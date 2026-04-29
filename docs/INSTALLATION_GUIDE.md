# Installation Guide

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- GCC or Clang (for C compilation)
- Make (for building C modules)

## Installation Steps

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd page-replacement-simulator
```

### 2. Install Node Dependencies

```bash
npm install
```
   
### 3. Build C Algorithms

```bash
mkdir backend/algorithms/build
gcc backend/algorithms/*.c -o backend/algorithms/build/algorithms_cli
```

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## Development Setup

For development with auto-restart on file changes:

```bash
npm run dev
```

## Building

### Rebuild C Algorithms

```bash
npm run build-c
```

### Running Tests

```bash
npm test          # Run JavaScript tests
npm run test-c    # Run C tests
```

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Ensure GCC is installed:
   ```bash
   gcc --version
   ```

2. Clean and rebuild:
   ```bash
   cd backend/algorithms
   make clean
   make
   ```

### Port Already in Use

If port 3000 is already in use, specify a different port:

```bash
PORT=3001 npm start
```

### Module Not Found

If you get module errors, ensure dependencies are installed:

```bash
npm install --force
```

## Configuration

Create a `.env` file in the project root for custom configuration:

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

