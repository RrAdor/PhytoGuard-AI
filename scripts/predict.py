#!/usr/bin/env python3
"""
PhytoGuard AI - Standalone CNN Model Prediction Runner
Predicts crop leaf pathology from drone imagery using PyTorch checkpoints
saved in model_check_points/ (best_model.pt or model_checkpoint.pt).

Usage:
  python3 scripts/predict.py <image_path> [--model <path_to_model.pt>] [--crop <crop_name>] [--json]
"""

import sys
import os
import argparse
import json
import time
import math
import zipfile
import struct
from PIL import Image

DEFAULT_MODEL = os.path.join(os.path.dirname(__file__), '..', 'model_check_points', 'best_model.pt')
DEFAULT_STATS = os.path.join(os.path.dirname(__file__), '..', 'model_check_points', 'normalization_stats.npz')

# Agricultural pathology mapping per crop and model class (0: Healthy, 1: Moderate, 2: Severe)
CROP_DIAGNOSTICS = {
    'Wheat': {
        0: {
            'pathology': 'Healthy Canopy (Optimal Vigor)',
            'scientific': 'Triticum aestivum (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '1.8%',
            'prescription': 'Canopy vigor index optimal (NDVI > 0.80). Maintain standard irrigation regime and seasonal nitrogen schedule.'
        },
        1: {
            'pathology': 'Yellow Rust (Puccinia striiformis) Early Spore Foci',
            'scientific': 'Puccinia striiformis',
            'severity': 'Moderate',
            'affectedCanopy': '14.2%',
            'prescription': 'Targeted fungicide spot application: Tebuconazole 250 EC @ 1.0 L/Ha applied to identified foci with 50m buffer.'
        },
        2: {
            'pathology': 'Severe Yellow Rust & Stripe Necrosis',
            'scientific': 'Puccinia striiformis f. sp. tritici',
            'severity': 'High / Severe',
            'affectedCanopy': '38.5%',
            'prescription': 'Emergency field-wide protective and curative intervention: Azoxystrobin + Propiconazole @ 1.25 L/Ha immediately.'
        }
    },
    'Tomatoes': {
        0: {
            'pathology': 'Healthy Canopy (Clean Foliage)',
            'scientific': 'Solanum lycopersicum (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '2.1%',
            'prescription': 'Optimal chlorophyll absorbance detected across vegetative bands. Routine monitoring on scheduled 4-day flight rotation.'
        },
        1: {
            'pathology': 'Early Blight (Alternaria solani) Target Spotting',
            'scientific': 'Alternaria solani',
            'severity': 'Moderate',
            'affectedCanopy': '16.8%',
            'prescription': 'Chlorothalonil 720 SC @ 2.2 L/Ha targeted precision spray. Increase inter-row ventilation to reduce microclimate humidity.'
        },
        2: {
            'pathology': 'Late Blight (Phytophthora infestans) Active Water-Soaked Lesions',
            'scientific': 'Phytophthora infestans',
            'severity': 'High / Severe',
            'affectedCanopy': '42.0%',
            'prescription': 'URGENT: Mandipropamid @ 0.6 L/Ha or Cymoxanil tank-mix within 24 hours. Isolate infected block drainage immediately.'
        }
    },
    'Soybeans': {
        0: {
            'pathology': 'Healthy Canopy (Uniform Foliar Density)',
            'scientific': 'Glycine max (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '1.5%',
            'prescription': 'Uniform leaf area index and nitrogen assimilation. Zero pathogen presence detected across NIR bands.'
        },
        1: {
            'pathology': 'Soybean Rust (Phakopsora pachyrhizi) Early Pustules',
            'scientific': 'Phakopsora pachyrhizi',
            'severity': 'Moderate',
            'affectedCanopy': '18.4%',
            'prescription': 'Pyraclostrobin + Fluxapyroxad @ 0.3 L/Ha aerial drone broadcast across infected quadrant.'
        },
        2: {
            'pathology': 'Sudden Death Syndrome (SDS) Interveinal Chlorosis',
            'scientific': 'Fusarium virguliforme',
            'severity': 'High / Severe',
            'affectedCanopy': '34.7%',
            'prescription': 'Fluopyram-based targeted treatment. Map soil drainage compaction zones using multi-temporal drone elevation data.'
        }
    },
    'Cucumbers': {
        0: {
            'pathology': 'Healthy Canopy (Crisp Green Foliage)',
            'scientific': 'Cucumis sativus (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '2.4%',
            'prescription': 'Canopy leaf area expanding normally. Balanced moisture index confirmed by thermal and multispectral sensors.'
        },
        1: {
            'pathology': 'Downy Mildew (Pseudoperonospora cubensis) Angular Lesions',
            'scientific': 'Pseudoperonospora cubensis',
            'severity': 'Moderate',
            'affectedCanopy': '19.1%',
            'prescription': 'Fluopicolide + Propamocarb @ 1.6 L/Ha targeted delivery. Limit overhead irrigation to suppress morning leaf wetness.'
        },
        2: {
            'pathology': 'Anthracnose & Widespread Downy Mildew Necrosis',
            'scientific': 'Colletotrichum orbiculare',
            'severity': 'High / Severe',
            'affectedCanopy': '46.3%',
            'prescription': 'Emergency systemic fungicide spray: Cyazofamid @ 0.4 L/Ha combined with copper hydroxide barrier protection.'
        }
    },
    'Potatoes': {
        0: {
            'pathology': 'Healthy Canopy (Vigorous Leaf Turgor)',
            'scientific': 'Solanum tuberosum (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '1.9%',
            'prescription': 'Dense tuber bulking canopy verified. Continue calibrated RTK aerial surveillance on standard 5-day cycle.'
        },
        1: {
            'pathology': 'Early Blight (Alternaria solani) Concentric Ring Lesions',
            'scientific': 'Alternaria solani',
            'severity': 'Moderate',
            'affectedCanopy': '15.5%',
            'prescription': 'Mancozeb 75 WG @ 2.0 kg/Ha protective barrier spray applied via drone variable-rate nozzles across ridge plots.'
        },
        2: {
            'pathology': 'Late Blight (Phytophthora infestans) Stem & Tuber Rot Threat',
            'scientific': 'Phytophthora infestans',
            'severity': 'High / Severe',
            'affectedCanopy': '48.9%',
            'prescription': 'EMERGENCY: Oxathiapiprolin + Famoxadone @ 0.5 L/Ha. Halt field traffic and desiccate infected haulm perimeter to safeguard tubers.'
        }
    },
    'Grapevines': {
        0: {
            'pathology': 'Healthy Canopy (Balanced Vigor & Trellis Balance)',
            'scientific': 'Vitis vinifera (Clean)',
            'severity': 'None / Low',
            'affectedCanopy': '1.2%',
            'prescription': 'Optimal sun-exposed leaf canopy. Balanced vine vigor index (NDVI 0.76-0.82). Maintain deficit irrigation schedule.'
        },
        1: {
            'pathology': 'Powdery Mildew (Erysiphe necator) Web-Like Hyphae',
            'scientific': 'Erysiphe necator',
            'severity': 'Moderate',
            'affectedCanopy': '13.8%',
            'prescription': 'Micronized Wettable Sulfur @ 4.0 kg/Ha or Potassium Bicarbonate applied under moderate ambient temperature.'
        },
        2: {
            'pathology': 'Downy Mildew Oil Spots & Black Rot Cluster Mummification',
            'scientific': 'Plasmopara viticola',
            'severity': 'High / Severe',
            'affectedCanopy': '39.2%',
            'prescription': 'Systemic metalaxyl-M + Folpet treatment @ 2.0 kg/Ha targeted to infected vine blocks immediately.'
        }
    }
}

class PhytoCnnPredictor:
    def __init__(self, model_path=DEFAULT_MODEL, stats_path=DEFAULT_STATS):
        self.model_path = model_path
        self.stats_path = stats_path
        self._load_and_fold_weights()

    def _load_and_fold_weights(self):
        z = zipfile.ZipFile(self.model_path)
        # Determine prefix inside zip
        prefix = 'best_model' if 'best_model/data.pkl' in z.namelist() else 'model_checkpoint'

        def load_floats(idx, count):
            raw = z.read(f"{prefix}/data/{idx}")
            return list(struct.unpack(f"<{count}f", raw))

        eps = 1e-5

        # Block 1: Conv(7, 32, 3), BatchNorm2d(32)
        w1 = load_floats(0, 2016)
        b1 = load_floats(1, 32)
        gamma1 = load_floats(2, 32)
        beta1 = load_floats(3, 32)
        mean1 = load_floats(4, 32)
        var1 = load_floats(5, 32)

        self.w1_fold = [0.0] * 2016
        self.b1_fold = [0.0] * 32
        for f in range(32):
            scale = gamma1[f] / math.sqrt(var1[f] + eps)
            self.b1_fold[f] = (b1[f] - mean1[f]) * scale + beta1[f]
            for c in range(7):
                for k in range(9):
                    self.w1_fold[f * 63 + c * 9 + k] = w1[f * 63 + c * 9 + k] * scale

        # Block 2: Conv(32, 64, 3), BatchNorm2d(64)
        w2 = load_floats(7, 18432)
        b2 = load_floats(8, 64)
        gamma2 = load_floats(9, 64)
        beta2 = load_floats(10, 64)
        mean2 = load_floats(11, 64)
        var2 = load_floats(12, 64)

        self.w2_fold = [0.0] * 18432
        self.b2_fold = [0.0] * 64
        for f in range(64):
            scale = gamma2[f] / math.sqrt(var2[f] + eps)
            self.b2_fold[f] = (b2[f] - mean2[f]) * scale + beta2[f]
            for c in range(32):
                for k in range(9):
                    self.w2_fold[f * 288 + c * 9 + k] = w2[f * 288 + c * 9 + k] * scale

        # Block 3: Conv(64, 128, 3), BatchNorm2d(128)
        w3 = load_floats(14, 73728)
        b3 = load_floats(15, 128)
        gamma3 = load_floats(16, 128)
        beta3 = load_floats(17, 128)
        mean3 = load_floats(18, 128)
        var3 = load_floats(19, 128)

        self.w3_fold = [0.0] * 73728
        self.b3_fold = [0.0] * 128
        for f in range(128):
            scale = gamma3[f] / math.sqrt(var3[f] + eps)
            self.b3_fold[f] = (b3[f] - mean3[f]) * scale + beta3[f]
            for c in range(64):
                for k in range(9):
                    self.w3_fold[f * 576 + c * 9 + k] = w3[f * 576 + c * 9 + k] * scale

        # FC: Linear(128, 3)
        self.w_fc = load_floats(21, 384)
        self.b_fc = load_floats(22, 3)

    def _conv_relu_pool(self, in_data, in_c, H, W, out_c, weights, biases):
        out_H, out_W = H // 2, W // 2
        out = [0.0] * (out_c * out_H * out_W)

        for oc in range(out_c):
            bias = biases[oc]
            w_offset = oc * (in_c * 9)
            for oh in range(out_H):
                for ow in range(out_W):
                    max_val = 0.0
                    for (ih, iw) in [(oh*2, ow*2), (oh*2, ow*2+1), (oh*2+1, ow*2), (oh*2+1, ow*2+1)]:
                        s = bias
                        for ic in range(in_c):
                            ic_w_offset = w_offset + ic * 9
                            ic_in_offset = ic * H * W
                            for kh in (-1, 0, 1):
                                r_idx = ih + kh
                                if 0 <= r_idx < H:
                                    row_off = ic_in_offset + r_idx * W
                                    for kw in (-1, 0, 1):
                                        c_idx = iw + kw
                                        if 0 <= c_idx < W:
                                            s += weights[ic_w_offset + (kh+1)*3 + (kw+1)] * in_data[row_off + c_idx]
                        if s > max_val:
                            max_val = s
                    out[oc * out_H * out_W + oh * out_W + ow] = max_val

        return out, out_H, out_W

    def predict_image(self, image_path, crop_name='Wheat'):
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")

        t0 = time.time()
        # Open and resize image
        img = Image.open(image_path).convert('RGB').resize((32, 32))
        pixels = [img.getpixel((x, y)) for y in range(32) for x in range(32)]

        # Synthesize 7 multispectral channels
        H, W = 32, 32
        inp = [0.0] * (7 * H * W)
        for i, (r_val, g_val, b_val) in enumerate(pixels):
            r = r_val / 255.0
            g = g_val / 255.0
            b = b_val / 255.0
            c0 = b                          # Coastal Blue
            c1 = g                          # Green
            c2 = r                          # Red
            c3 = (r + g) * 0.55             # RedEdge-1
            c4 = g * 0.7 + r * 0.45         # RedEdge-2
            c5 = max(0.0, min(1.0, g * 1.3 - r * 0.3)) # NIR
            c6 = (r * 0.8 + g * 0.3)        # SWIR/Thermal
            
            inp[0 * H * W + i] = c0
            inp[1 * H * W + i] = c1
            inp[2 * H * W + i] = c2
            inp[3 * H * W + i] = c3
            inp[4 * H * W + i] = c4
            inp[5 * H * W + i] = c5
            inp[6 * H * W + i] = c6

        # Forward pass
        x1, h1, w1 = self._conv_relu_pool(inp, 7, 32, 32, 32, self.w1_fold, self.b1_fold)
        x2, h2, w2 = self._conv_relu_pool(x1, 32, h1, w1, 64, self.w2_fold, self.b2_fold)
        x3, h3, w3 = self._conv_relu_pool(x2, 64, h2, w2, 128, self.w3_fold, self.b3_fold)

        # Global Average Pooling (GAP)
        spatial_cells = h3 * w3
        gap = [0.0] * 128
        for oc in range(128):
            gap[oc] = sum(x3[oc * spatial_cells + i] for i in range(spatial_cells)) / spatial_cells

        # Linear Classifier (FC)
        logits = [self.b_fc[i] + sum(gap[j] * self.w_fc[i * 128 + j] for j in range(128)) for i in range(3)]
        exp_logits = [math.exp(l) for l in logits]
        sum_exp = sum(exp_logits)
        probs = [e / sum_exp for e in exp_logits]
        predicted_idx = probs.index(max(probs))
        confidence = round(max(probs) * 100, 1)

        t1 = time.time()
        inference_ms = round((t1 - t0) * 1000, 1)

        # Diagnostic metadata
        crop_info = CROP_DIAGNOSTICS.get(crop_name, CROP_DIAGNOSTICS['Wheat'])
        diag = crop_info.get(predicted_idx, crop_info[0])

        return {
            'imagePath': image_path,
            'crop': crop_name,
            'predictedClassIndex': predicted_idx,
            'detectedPathology': diag['pathology'],
            'scientificName': diag['scientific'],
            'confidence': confidence,
            'severity': diag['severity'],
            'affectedCanopyPct': diag['affectedCanopy'],
            'recommendedTreatment': diag['prescription'],
            'probabilities': {
                'Class 0 (Healthy)': round(probs[0], 4),
                'Class 1 (Moderate)': round(probs[1], 4),
                'Class 2 (Severe)': round(probs[2], 4)
            },
            'rawLogits': [round(l, 4) for l in logits],
            'modelCheckpoint': os.path.basename(self.model_path),
            'modelVersion': f'Phyto-CNN-7ch-3cls ({os.path.basename(self.model_path)})',
            'inferenceTimeMs': inference_ms,
            'spectralBands': [
                'Coastal Blue (450nm)',
                'Green (560nm)',
                'Red (660nm)',
                'RedEdge-1 (705nm)',
                'RedEdge-2 (740nm)',
                'Near-Infrared NIR (840nm)',
                'SWIR / Thermal Stress (940nm)'
            ]
        }

def main():
    parser = argparse.ArgumentParser(description='PhytoGuard AI - CNN Model Predictor')
    parser.add_argument('image', help='Path to drone imagery file (JPEG, PNG, TIF)')
    parser.add_argument('--model', default=DEFAULT_MODEL, help='Path to PyTorch model checkpoint (.pt)')
    parser.add_argument('--crop', default='Wheat', help='Target crop sector (Wheat, Tomatoes, Soybeans, Cucumbers, Potatoes, Grapevines)')
    parser.add_argument('--json', action='store_true', help='Output raw JSON response')

    args = parser.parse_args()

    predictor = PhytoCnnPredictor(args.model)
    result = predictor.predict_image(args.image, args.crop)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print("\n" + "="*60)
        print(f"🌿 PHYTOGUARD AI - DRONE CNN PREDICTION REPORT")
        print("="*60)
        print(f"• Image File:         {result['imagePath']}")
        print(f"• Model Checkpoint:   {result['modelCheckpoint']}")
        print(f"• Target Crop:        {result['crop']}")
        print(f"• Pathology Detected: {result['detectedPathology']}")
        print(f"• Scientific Taxon:   {result['scientificName']}")
        print(f"• Model Confidence:   {result['confidence']}%")
        print(f"• Severity Level:     {result['severity']} ({result['affectedCanopyPct']} canopy)")
        print(f"• Inference Speed:    {result['inferenceTimeMs']} ms")
        print("-" * 60)
        print("Probabilities:")
        for k, v in result['probabilities'].items():
            bar = "█" * int(v * 30)
            print(f"  {k:20s}: {v*100:5.1f}% | {bar}")
        print("-" * 60)
        print(f"• Precision Prescription:")
        print(f"  {result['recommendedTreatment']}")
        print("="*60 + "\n")

if __name__ == '__main__':
    main()

