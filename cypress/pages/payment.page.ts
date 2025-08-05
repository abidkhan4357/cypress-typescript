export class PaymentPage {
  private static instance: PaymentPage;

  static getInstance(): PaymentPage {
    if (!PaymentPage.instance) {
      PaymentPage.instance = new PaymentPage();
    }
    return PaymentPage.instance;
  }

  // Selectors
  private get paymentForm() { return 'form.payment-form'; }
  private get nameOnCardInput() { return 'input[name="name_on_card"]'; }
  private get cardNumberInput() { return 'input[name="card_number"]'; }
  private get cvcInput() { return 'input[name="cvc"]'; }
  private get expiryMonthInput() { return 'input[name="expiry_month"]'; }
  private get expiryYearInput() { return 'input[name="expiry_year"]'; }
  private get submitButton() { return '#submit'; }

  // Actions
  completePayment(
    nameOnCard: string,
    cardNumber: string, 
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ): void {
    cy.get(this.nameOnCardInput).type(nameOnCard);
    cy.get(this.cardNumberInput).type(cardNumber);
    cy.get(this.cvcInput).type(cvc);
    cy.get(this.expiryMonthInput).type(expiryMonth);
    cy.get(this.expiryYearInput).type(expiryYear);
    cy.get(this.submitButton).click();
  }
}

export const paymentPage = PaymentPage.getInstance();