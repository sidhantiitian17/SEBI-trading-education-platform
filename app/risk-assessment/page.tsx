import { MainLayout } from '@/components/navigation';
import { RiskAssessmentTool } from '@/components/risk-assessment-tool';

export default function RiskAssessmentPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Risk Assessment & Portfolio Analysis</h1>
            <p className="text-muted-foreground">
              Analyze your portfolio risk, assess your risk tolerance, and get personalized recommendations
              for better risk management in your investment strategy.
            </p>
          </div>

          <RiskAssessmentTool />
        </div>
      </div>
    </MainLayout>
  );
}
