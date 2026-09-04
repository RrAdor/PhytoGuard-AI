<div align="center">

# 🌱 PhytoGuard AI

**Detecting crop disease beyond what the human eye can see — using hyperspectral imaging and deep learning.**

Built for the **Beyond Visible Spectrum: AI for Agriculture** competition.

[![Made with Vite](https://img.shields.io/badge/Made%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PyTorch](https://img.shields.io/badge/Model-PyTorch-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![License](https://img.shields.io/github/license/RrAdor/PhytoGuard-AI)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/RrAdor/PhytoGuard-AI)](https://github.com/RrAdor/PhytoGuard-AI/commits/main)

[Live Demo](#) · [Report Bug](https://github.com/RrAdor/PhytoGuard-AI/issues) · [Request Feature](https://github.com/RrAdor/PhytoGuard-AI/issues)

</div>

<!-- Swap for an actual screenshot/GIF of the deployed site -->
<div align="center">
  <img src="public/assets/screenshot-hero.png" alt="PhytoGuard AI screenshot" width="80%">
</div>

---

## 📖 Table of Contents

- [About](#-about)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Development](#development)
  - [Production Build](#production-build)
  - [Local QA](#local-qa)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)


---

## 🌾 About

PhytoGuard AI classifies crop leaf health directly from **hyperspectral imagery** — 125-band pixel data captured well beyond the visible RGB spectrum — to distinguish **Healthy**, **Rust-infected**, and **Other** conditions before disease is visible to the naked eye. Early, non-invasive detection like this can help growers intervene before an outbreak spreads across a field.

This repo is the frontend for the project: a Vite-powered site presenting the model, its results, and a demo interface

## 🔬 How It Works

The pipeline behind PhytoGuard AI, from raw hyperspectral cube to prediction:

1. **Data**: 64×64 pixel hyperspectral patches, 125 spectral bands each, across 3 balanced classes (Health / Rust / Other — 197 samples each, 591 total). Split 70/15/15 into train/val/test with stratification.
2. **Preprocessing**: Per-band z-score normalization (mean/std computed from the training split only, to avoid leakage). A known sentinel padding band (126th band, constant value) is detected and stripped.
3. **Dimensionality reduction**: Rather than feeding all 125 raw bands into the CNN, each pixel's spectrum is projected through:
   - **LDA** (Linear Discriminant Analysis, 2 components) — captures the directions that best separate the 3 classes.
   - **PCA** (Incremental PCA, top 5 components) — captures the directions of highest variance.
   - These are concatenated into a compact **7-channel** representation per pixel, reshaped back into a 64×64×7 image.
4. **Model — `PhytoGuardCNN2D`**: A lightweight 2D CNN (3 conv blocks: 32→64→128 filters, BatchNorm + ReLU + MaxPool, global average pooling, dropout 0.4, final linear layer to 3 classes). Trained with Adam, `ReduceLROnPlateau` scheduling, and random flip/rotation augmentation.
5. **Evaluation**: Confusion matrix, per-class precision/recall/F1, and one-vs-rest ROC/AUC curves on a held-out test set.

> Why PCA+LDA before the CNN instead of raw 125-band input? It keeps the network small and fast to train on a modest dataset (~590 images) while explicitly injecting class-discriminative structure (via LDA) alongside general variance (via PCA) — a practical fit for the compute/time constraints of a competition setting.



## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend build tool | [Vite](https://vitejs.dev/) |
| Frontend language | JavaScript |
| Model training | PyTorch |
| Feature extraction | scikit-learn (Incremental PCA, LDA) |
| Data format | Hyperspectral `.tif`  |

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Local QA

Start the dev server, then run:

```bash
npm run qa
```

The QA report and screenshots are written to `qa/` and are ignored by Git.

## 📁 Project Structure

```
PhytoGuard-AI/
├── src/              # application JavaScript, data, and styles
├── public/assets/    # static images (screenshots, result plots)
├── scripts/          # local verification scripts
├── index.html        # Vite entry point
└── qa/               # QA reports & screenshots (gitignored)
```

## 🗺️ Roadmap

- [ ] Connect frontend to a live inference endpoint for the trained model
- [ ] Display confusion matrix / ROC curves as interactive charts
- [ ] Add an upload-your-own-image demo path
- [ ] Mobile-responsive polish

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss what you'd like to change, or submit a pull request directly.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

