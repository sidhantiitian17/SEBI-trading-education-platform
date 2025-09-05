import { MainLayout } from '@/components/navigation';
import { PortfolioDiversificationTool } from '@/components/portfolio-diversification-tool';

export default function PortfolioDiversificationPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Portfolio Diversification & Optimization</h1>
            <p className="text-muted-foreground">
              Optimize your investment portfolio using advanced diversification strategies.
              Balance risk and return through intelligent asset allocation and sector diversification.
            </p>
          </div>

          <PortfolioDiversificationTool />
        </div>
      </div>
    </MainLayout>
  );
}
