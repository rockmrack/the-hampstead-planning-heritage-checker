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
    
    render(
      <StatusCard
        status="RED"
        isListed={true}
        listedBuildingGrade="II"
        listedBuildingName="Test Listed Building"
        inConservationArea={true}
        conservationAreaName="Test Conservation Area"
        hasArticle4={true}
        address="10 Flask Walk, Hampstead"
        onDownloadReport={jest.fn()}
      />
    );

    expect(screen.getByText(/Listed Building/i)).toBeInTheDocument();
    expect(screen.getByText(/Grade II/i)).toBeInTheDocument();
  });

  it('should render AMBER status card correctly', async () => {
    const { StatusCard } = await import('@/components/search/StatusCard');
    
    render(
      <StatusCard
        status="AMBER"
        isListed={false}
        inConservationArea={true}
        conservationAreaName="Hampstead Conservation Area"
        hasArticle4={true}
        address="45 Flask Walk, Hampstead"
        onDownloadReport={jest.fn()}
      />
    );

    expect(screen.getByText(/Conservation Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Hampstead Conservation Area/i)).toBeInTheDocument();
  });

  it('should render GREEN status card correctly', async () => {
    const { StatusCard } = await import('@/components/search/StatusCard');
    
    render(
      <StatusCard
        status="GREEN"
        isListed={false}
        inConservationArea={false}
        hasArticle4={false}
        address="100 Cricklewood Lane"
        onDownloadReport={jest.fn()}
      />
    );

    expect(screen.getByText(/No Heritage Constraints/i)).toBeInTheDocument();
  });

  it('should call onDownloadReport when download button is clicked', async () => {
    const user = userEvent.setup();
    const mockDownload = jest.fn();
    
    const { StatusCard } = await import('@/components/search/StatusCard');
    
    render(
      <StatusCard
        status="AMBER"
        isListed={false}
        inConservationArea={true}
        conservationAreaName="Test Conservation Area"
        hasArticle4={false}
        address="Test Address"
        onDownloadReport={mockDownload}
      />
    );

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
