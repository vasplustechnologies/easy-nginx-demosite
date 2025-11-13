const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1'; // Changed from 0.0.0.0

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
const loansDB = new Map();

// Loan class
class Loan {
  constructor(customerName, amount, termMonths, interestRate = 5.0) {
    this.loanId = uuidv4().substring(0, 8);
    this.customerName = customerName;
    this.amount = parseFloat(amount);
    this.termMonths = parseInt(termMonths);
    this.interestRate = parseFloat(interestRate);
    this.status = 'PENDING';
    this.createdAt = new Date().toISOString();
    this.monthlyPayment = this.calculateMonthlyPayment();
  }

  calculateMonthlyPayment() {
    const monthlyRate = this.interestRate / 100 / 12;
    const payment = (this.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -this.termMonths));
    return Math.round(payment * 100) / 100;
  }

  toJSON() {
    return {
      loanId: this.loanId,
      customerName: this.customerName,
      amount: this.amount,
      termMonths: this.termMonths,
      interestRate: this.interestRate,
      status: this.status,
      monthlyPayment: this.monthlyPayment,
      createdAt: this.createdAt
    };
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    service: 'bank-loan-service',
    version: '1.0.0',
    message: 'Bank Loan Management API is running!',
    endpoints: {
      apply_loan: 'POST /loans/apply',
      get_loan: 'GET /loans/:loanId',
      list_loans: 'GET /loans',
      approve_loan: 'PUT /loans/:loanId/approve',
      reject_loan: 'PUT /loans/:loanId/reject',
      health: 'GET /health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'bank-loan-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    totalLoans: loansDB.size
  });
});

// Apply for a loan
app.post('/loans/apply', (req, res) => {
  try {
    const { customerName, amount, termMonths, interestRate = 5.0 } = req.body;

    if (!customerName || !amount || !termMonths) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, amount, termMonths'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Loan amount must be positive'
      });
    }

    if (termMonths <= 0) {
      return res.status(400).json({
        error: 'Loan term must be positive'
      });
    }

    const loan = new Loan(customerName, amount, termMonths, interestRate);
    loansDB.set(loan.loanId, loan);

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loan: loan
    });

  } catch (error) {
    console.error('Error applying for loan:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get loan by ID
app.get('/loans/:loanId', (req, res) => {
  const loan = loansDB.get(req.params.loanId);
  
  if (!loan) {
    return res.status(404).json({
      error: 'Loan not found'
    });
  }

  res.json({
    loan: loan
  });
});

// List all loans
app.get('/loans', (req, res) => {
  const loans = Array.from(loansDB.values());
  
  res.json({
    loans: loans,
    total: loans.length
  });
});

// Approve loan
app.put('/loans/:loanId/approve', (req, res) => {
  const loan = loansDB.get(req.params.loanId);
  
  if (!loan) {
    return res.status(404).json({
      error: 'Loan not found'
    });
  }

  if (loan.status !== 'PENDING') {
    return res.status(400).json({
      error: `Loan already ${loan.status}`
    });
  }

  // Auto-approve loans under $50,000
  if (loan.amount > 50000) {
    loan.status = 'REJECTED';
    return res.json({
      message: 'Loan rejected: Amount too high for auto-approval',
      loan: loan
    });
  } else {
    loan.status = 'APPROVED';
    return res.json({
      message: 'Loan approved successfully',
      loan: loan
    });
  }
});

// Reject loan
app.put('/loans/:loanId/reject', (req, res) => {
  const loan = loansDB.get(req.params.loanId);
  
  if (!loan) {
    return res.status(404).json({
      error: 'Loan not found'
    });
  }

  loan.status = 'REJECTED';
  
  res.json({
    message: 'Loan rejected',
    loan: loan
  });
});

// Start server - CHANGED HOST to 127.0.0.1
app.listen(PORT, HOST, () => {
  console.log(`🚀 Bank Loan Service running on http://${HOST}:${PORT}`);
  console.log(`📍 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📊 API documentation: http://${HOST}:${PORT}/`);
});