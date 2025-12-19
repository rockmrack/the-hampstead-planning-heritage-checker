import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('StatusCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render RED status card correctly', async () => {
    const { StatusCard } = await import('@/components/search/StatusCard');

    const mockResult = {
      status: 'RED' as const,
      address: '10 Flask Walk, Hampstead',
      coordinates: { latitude: 51.5574, longitude: -0.1782 },
      postcode: 'NW3 1HJ',
      borough: 'Camden',
      listedBuilding: {
        id: 1,
        listEntryNumber: '1234567',
        name: 'Test Listed Building',
        grade: 'II' as const,
        location: { type: 'Point' as const, coordinates: [-0.1782, 51.5574] },
        hyperlink: 'https://historicengland.org.uk/listing/the-list/list-entry/1234567',
      },
      conservationArea: {
        id: 1,
        name: 'Test Conservation Area',
        borough: 'Camden',
        hasArticle4: true,
      },
      hasArticle4: true,
      timestamp: new Date().toISOString(),
      searchId: 'test-123',
    };

    render(<StatusCard result={mockResult} onDownloadPDF={jest.fn()} />);

    expect(screen.getByText(/Listed Building/i)).toBeInTheDocument();
    expect(screen.getByText(/Grade II/i)).toBeInTheDocument();
  });

  it('should render AMBER status card correctly', async () => {
    const { StatusCard } = await import('@/components/search/StatusCard');

    const mockResult = {
      status: 'AMBER' as const,
      address: '45 Flask Walk, Hampstead',
      coordinates: { latitude: 51.5574, longitude: -0.1782 },
      postcode: 'NW3 1HJ',
      borough: 'Camden',
      conservationArea: {
        id: 1,
        name: 'Hampstead Conservation Area',
        borough: 'Camden',
        hasArticle4: true,
      },
      hasArticle4: true,
      timestamp: new Date().toISOString(),
      searchId: 'test-456',
    };

    render(<StatusCard result={mockResult} onDownloadPDF={jest.fn()} />);

    expect(screen.getByText(/Conservation Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Hampstead Conservation Area/i)).toBeInTheDocument();
  });

  it('should render GREEN status card correctly', async () => {
    const { StatusCard } = await import('@/components/search/StatusCard');

    const mockResult = {
      status: 'GREEN' as const,
      address: '100 Cricklewood Lane',
      coordinates: { latitude: 51.5574, longitude: -0.1782 },
      postcode: 'NW2 1AB',
      hasArticle4: false,
      timestamp: new Date().toISOString(),
      searchId: 'test-789',
    };

    render(<StatusCard result={mockResult} onDownloadPDF={jest.fn()} />);

    expect(screen.getByText(/No Heritage Constraints/i)).toBeInTheDocument();
  });

  it('should call onDownloadPDF when download button is clicked', async () => {
    const user = userEvent.setup();
    const mockDownload = jest.fn();

    const { StatusCard } = await import('@/components/search/StatusCard');

    const mockResult = {
      status: 'AMBER' as const,
      address: 'Test Address',
      coordinates: { latitude: 51.5574, longitude: -0.1782 },
      postcode: 'NW3 1HJ',
      conservationArea: {
        id: 1,
        name: 'Test Conservation Area',
        borough: 'Camden',
        hasArticle4: false,
      },
      hasArticle4: false,
      timestamp: new Date().toISOString(),
      searchId: 'test-999',
    };

    render(<StatusCard result={mockResult} onDownloadPDF={mockDownload} />);

    const downloadButton = screen.getByRole('button', { name: /download.*report/i });
    await user.click(downloadButton);

    expect(mockDownload).toHaveBeenCalled();
  });
});

describe('LoadingSpinner Component', () => {
  it('should render loading spinner', async () => {
    const { LoadingSpinner } = await import('@/components/ui/LoadingSpinner');
    
    render(<LoadingSpinner />);
    
    // Check for spinner element
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with custom size', async () => {
    const { LoadingSpinner } = await import('@/components/ui/LoadingSpinner');
    
    render(<LoadingSpinner size="lg" />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('Header Component', () => {
  it('should render header with logo', async () => {
    const { Header } = await import('@/components/layout/Header');
    
    render(<Header />);
    
    expect(screen.getByText(/Heritage/i)).toBeInTheDocument();
  });

  it('should have navigation links', async () => {
    const { Header } = await import('@/components/layout/Header');
    
    render(<Header />);
    
    // Check for navigation links
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('should render footer with company info', async () => {
    const { Footer } = await import('@/components/layout/Footer');
    
    render(<Footer />);
    
    // Check for company name
    expect(screen.getByText(/Hampstead/i)).toBeInTheDocument();
  });

  it('should have legal links', async () => {
    const { Footer } = await import('@/components/layout/Footer');
    
    render(<Footer />);
    
    // Check for legal links
    expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
  });
});

describe('ErrorBoundary Component', () => {
  // Suppress console errors for this test
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when no error', async () => {
    const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');
    
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render fallback when error occurs', async () => {
    const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');
    
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    render(
      <ErrorBoundary fallback={<div>Error Fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Error Fallback')).toBeInTheDocument();
  });
});
