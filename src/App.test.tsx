import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { APIProvider } from '@vis.gl/react-google-maps';

// Mock the APIProvider since we don't have an API key in the test environment
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: () => <div>Map Component</div>,
  AdvancedMarker: () => <div>Marker</div>,
  Pin: () => <div>Pin</div>,
}));

describe('App', () => {
  it('renders the app correctly', () => {
    // Simple render test to make sure something shows up
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
    
    // Check for main sections
    expect(screen.getAllByText(/CivicSync/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Voter Journey Roadmap/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Polling Locator/i).length).toBeGreaterThan(0);
  });
});
