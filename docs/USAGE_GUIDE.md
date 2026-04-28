# Usage Guide

## Getting Started

### 1. Start the Application

Open your web browser and navigate to `http://localhost:3000`

### 2. Understanding the Interface

The simulator interface consists of three main sections:

#### Control Panel
- **Algorithm Selection**: Choose from FIFO, LRU, LFU, or Optimal
- **Frame Size**: Set the number of frames (memory slots) available
- **Page Sequence**: Enter the sequence of page references

#### Visualization
- Shows the current state of memory frames
- Highlights page faults with red indicators
- Color codes show active pages vs. empty frames

#### Statistics
- **Page Faults**: Total number of page faults that occurred
- **Fault Rate**: Percentage of page faults relative to total references
- **Frame Size**: Number of frames used
- **Sequence Length**: Total number of page references

## How to Run a Simulation

1. **Select an Algorithm**
   - Click the "Algorithm" dropdown and choose one of the four options

2. **Set Frame Size**
   - Enter a number between 1 and 10 for the frame size
   - Smaller frame sizes typically result in more page faults

3. **Enter Page Sequence**
   - Enter page numbers separated by commas
   - Example: `7,0,1,2,0,3,0,4,2,3,0,3,2`

4. **Run Simulation**
   - Click the "Run Simulation" button
   - Results will display immediately

## Interpreting Results

### Page Faults
Each page fault represents a miss in memory, requiring the page to be loaded from disk. Lower page faults indicate better algorithm performance.

### Visualization
- **Green Frames**: Pages currently in memory
- **Red Indication**: Page fault occurred at this step
- **Gray Frames**: Empty frame slots

### Statistics Panel
Compare the metrics from different algorithms on the same page sequence to understand their relative performance.

## Example Scenarios

### Scenario 1: FIFO Anomaly
- Frame Size: 3
- Page Sequence: `3,2,1,0,3,2,4,3,2,1,0,4`

Run with different frame sizes (3 and 4) to see how FIFO can produce more faults with more frames.

### Scenario 2: Algorithm Comparison
- Frame Size: 2
- Page Sequence: `1,2,3,4,1,2,5,1,2,3,4,5`

Compare all algorithms to see how LRU and LFU generally perform better than FIFO.

### Scenario 3: Optimal Algorithm
- Frame Size: 2
- Page Sequence: `7,0,1,2,0,3,0,4,2,3,0,3,2`

Notice how Optimal has the minimum number of faults.

## Tips and Tricks

1. **Testing Algorithms**: Use the same page sequence with different algorithms to compare performance

2. **Frame Size Impact**: Observe how increasing frame size affects fault rates

3. **Pattern Recognition**: Try sequences with repeating patterns to see how different algorithms handle them

4. **Learning Tool**: Use the statistics to verify your manual calculations

## Keyboard Shortcuts

- **Enter**: Submit the simulation form
- **Tab**: Navigate between form fields

## Performance Tips

- Keep page sequence length under 100 for better visualization
- Use frame sizes between 1 and 10 for realistic scenarios
- Page numbers should be in the range 0-9 for clarity

