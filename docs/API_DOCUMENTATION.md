# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get Available Algorithms

**Endpoint:** `GET /algorithms`

**Description:** Returns a list of all available page replacement algorithms.

**Response:**
```json
[
  {
    "name": "FIFO",
    "description": "First In First Out"
  },
  {
    "name": "LRU",
    "description": "Least Recently Used"
  },
  {
    "name": "LFU",
    "description": "Least Frequently Used"
  },
  {
    "name": "Optimal",
    "description": "Optimal (Belady's Algorithm)"
  }
]
```

### 2. Run Simulation

**Endpoint:** `POST /simulate`

**Description:** Runs a page replacement simulation with a specific algorithm.

**Request Body:**
```json
{
  "algorithm": "FIFO",
  "pageSequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
  "frameSize": 3
}
```

**Response:**
```json
{
  "success": true,
  "algorithm": "FIFO",
  "frameSize": 3,
  "pageSequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
  "result": {
    "pageFaults": 9,
    "frames": [7, 0, 1],
    "faultSequence": [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0]
  }
}
```

### 3. Compare Algorithms

**Endpoint:** `POST /compare`

**Description:** Compares all algorithms for a given page sequence.

**Request Body:**
```json
{
  "pageSequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
  "frameSize": 3
}
```

**Response:**
```json
{
  "success": true,
  "comparison": {
    "FIFO": { "pageFaults": 9 },
    "LRU": { "pageFaults": 8 },
    "LFU": { "pageFaults": 8 },
    "Optimal": { "pageFaults": 7 }
  }
}
```

## Error Handling

All endpoints return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error

Error responses include a message:
```json
{
  "error": {
    "message": "Invalid request",
    "status": 400
  }
}
```
