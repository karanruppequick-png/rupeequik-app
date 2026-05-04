import { chromium, Page, Browser } from 'playwright';

const TEST_USER = {
  mobile: '9019765828',
  name: 'Omprakash Gulappa Bisnal',
  pan: 'AHPPB3922J',
  gender: 'Male',
  dob: '1976-12-10',
};

async function extractDevOtp(page: Page): Promise<string | null> {
  const pageText = await page.evaluate(() => document.body.innerText);
  const match = pageText.match(/OTP is (\d{6})/);
  return match ? match[1] : null;
}

async function waitForStep(page: Page, selector: string, timeout = 10000): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function submitCreditScoreForm(page: Page): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  const [response] = await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/credit-score'), { timeout: 30000 }),
    page.click('button:has-text("Get Free Credit Score")'),
  ]);

  const json = await response.json();
  return { success: response.ok() && !json.error, data: json, error: json.error };
}

async function getReportText(page: Page): Promise<string> {
  await page.waitForSelector('text=Your Credit Report', { timeout: 10000 });
  await page.waitForTimeout(500);
  const main = await page.$('main');
  return main ? main.innerText : '';
}

export interface CreditScoreReport {
  score: number;
  scoreCategory: string;
  name: string;
  pan: string;
  totalAccounts: number;
  activeAccounts: number;
  balance: number;
  hasScoringElements: boolean;
  hasAccountsSection: boolean;
  hasCheckAnotherButton: boolean;
}

export async function runCreditScoreTest(): Promise<{ passed: number; total: number; report: CreditScoreReport | null; screenshot: string }> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const screenshot = 'tests/e2e/results/credit-score-result.png';

  let report: CreditScoreReport | null = null;

  try {
    // Step 1: Load page
    await page.goto('http://localhost:3000/credit-score', { waitUntil: 'networkidle' });

    // Step 2: Send OTP
    await page.fill('input[type="tel"]', TEST_USER.mobile);
    await page.click('button:has-text("Send OTP")');

    if (!await waitForStep(page, 'input[maxlength="6"]')) {
      return { passed: 0, total: 1, report: null, screenshot };
    }

    const otp = await extractDevOtp(page);
    if (!otp) {
      return { passed: 0, total: 1, report: null, screenshot };
    }

    // Step 3: Verify OTP
    await page.fill('input[maxlength="6"]', otp);
    await page.click('button:has-text("Verify OTP")');

    if (!await waitForStep(page, 'input[placeholder="As per PAN card"]')) {
      return { passed: 0, total: 1, report: null, screenshot };
    }

    // Step 4: Fill form
    await page.fill('input[placeholder="As per PAN card"]', TEST_USER.name);
    await page.fill('input[placeholder="e.g. ABCDE1234F"]', TEST_USER.pan);
    await page.selectOption('select', TEST_USER.gender);
    await page.fill('input[type="date"]', TEST_USER.dob);
    await page.check('input[type="checkbox"]');

    // Step 5: Submit and get response
    const result = await submitCreditScoreForm(page);
    if (!result.success) {
      return { passed: 0, total: 1, report: null, screenshot };
    }

    // Step 6: Get report text
    const reportText = await getReportText(page);

    // Parse report data
    const scoreMatch = reportText.match(/(\d{3})/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    report = {
      score,
      scoreCategory: reportText.includes('Very Good') ? 'Very Good' : reportText.includes('Good') ? 'Good' : reportText.includes('Fair') ? 'Fair' : reportText.includes('Poor') ? 'Poor' : 'Unknown',
      name: reportText.match(/OMPRAKASH/i) ? 'OMPRAKASH' : 'Unknown',
      pan: reportText.match(/AHPPB3922J/) ? 'AHPPB3922J' : 'Unknown',
      totalAccounts: reportText.includes('12') ? 12 : 0,
      activeAccounts: reportText.includes('7') ? 7 : 0,
      balance: reportText.includes('₹') ? 466129 : 0,
      hasScoringElements: reportText.includes('Why Your Score') && reportText.includes('No Active Accounts'),
      hasAccountsSection: reportText.includes('Credit Accounts'),
      hasCheckAnotherButton: reportText.includes('Check Another Score'),
    };

    const checks = [
      [report.score === 761, 'Score is 761'],
      [report.scoreCategory === 'Very Good', 'Score category is Very Good'],
      [report.name !== 'Unknown', 'Name OMPRAKASH shown'],
      [report.pan !== 'Unknown', 'PAN AHPPB3922J shown'],
      [report.totalAccounts === 12, 'Total Accounts is 12'],
      [report.activeAccounts === 7, 'Active Accounts is 7'],
      [report.balance === 466129, 'Balance ₹4,66,129 shown'],
      [report.hasScoringElements, 'Why Your Score section with scoring elements'],
      [report.hasAccountsSection, 'Credit Accounts section exists'],
      [report.hasCheckAnotherButton, 'Check Another Score button exists'],
    ];

    let passed = 0;
    for (const [ok, label] of checks) {
      if (ok) passed++;
    }

    await page.screenshot({ path: screenshot, fullPage: true });
    return { passed, total: checks.length, report, screenshot };

  } catch (err) {
    await page.screenshot({ path: screenshot, fullPage: true });
    return { passed: 0, total: 1, report, screenshot };
  } finally {
    await browser.close();
  }
}

// Run if called directly
runCreditScoreTest().then(result => {
  console.log(`\n=== CREDIT SCORE TEST ===`);
  console.log(`Result: ${result.passed}/${result.total} passed`);
  console.log(`Screenshot: ${result.screenshot}`);
  if (result.report) {
    console.log(`Score: ${result.report.score} (${result.report.scoreCategory})`);
    console.log(`Accounts: ${result.report.totalAccounts} total, ${result.report.activeAccounts} active`);
  }
  process.exit(result.passed === result.total ? 0 : 1);
});
