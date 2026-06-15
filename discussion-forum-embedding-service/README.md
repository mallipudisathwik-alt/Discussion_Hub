# Discussion Forum - Embedding Service

## Overview
Generates 384-dimension sentence embeddings using all-MiniLM-L6-v2 for semantic search.

## Setup

```bash
pip install -r requirements.txt
```

## Run

```bash
python embedding_service.py
```

Runs on http://localhost:5001

## API

- POST /embed - `{"text": "your text here"}` → `{"embedding": [0.023, -0.145, ...]}`
- GET /health - Health check

## Dependencies
flask, sentence-transformers, torch
