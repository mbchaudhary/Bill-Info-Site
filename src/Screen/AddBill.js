import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddBill() {
  const nav = useNavigate();

  const [billNo, setBillNo] = useState(1);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('NotPay');

  const isEdit = localStorage.getItem('isEdit');
  const isIndex = localStorage.getItem('EditDataIndex');

  useEffect(() => {
    const bills = JSON.parse(localStorage.getItem('list')) || [];
    if (isIndex !== null) {
      const bill = bills[isIndex];
      setBillNo(bill.billNo);
      setDate(bill.date);
      setName(bill.name);
      setAmount(bill.amount);
      setPaymentStatus(bill.paymentStatus);
    } else {
      const lastBillNo = localStorage.getItem('lastBillNo');
      setBillNo(lastBillNo ? parseInt(lastBillNo) + 1 : 1);
      const currentDate = getCurrentDate();
      setDate(currentDate);
    }
  }, [isIndex]);

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const billData = { billNo, date, name, amount, paymentStatus };
    const list = JSON.parse(localStorage.getItem('list')) || [];

    if (isEdit) {
      list[isIndex] = billData;
      localStorage.removeItem('isEdit');
      localStorage.removeItem('EditDataIndex');
    } else {
      list.push(billData);
      localStorage.setItem('lastBillNo', billNo);
    }

    localStorage.setItem('list', JSON.stringify(list));
    setDate('');
    setName('');
    setAmount('');
    setPaymentStatus('NotPay');
    setBillNo(billNo + 1);
    nav('/');
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">{isEdit ? 'Edit Bill' : 'Add New Bill'}</h4>
                  <button className="btn btn-light text-primary" onClick={() => nav('/')}>
                    <i className="bi bi-arrow-left"></i> Back
                  </button>
                </div>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Bill Number */}
                  <div className="mb-4">
                    <label htmlFor="billNo" className="form-label fw-bold">Bill No.</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      id="billNo"
                      value={billNo}
                      disabled
                    />
                  </div>

                  {/* Date and Name */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="date" className="form-label fw-bold">Date</label>
                      <input
                        type="date"
                        className="form-control shadow-sm"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={getCurrentDate()}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label fw-bold">Name</label>
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount and Payment Status */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="amount" className="form-label fw-bold">Amount</label>
                      <input
                        type="number"
                        className="form-control shadow-sm"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        min="0"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="paymentStatus" className="form-label fw-bold">Payment Status</label>
                      <select
                        className="form-select shadow-sm"
                        id="paymentStatus"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="NotPay">Not Paid</option>
                        <option value="Pay">Paid</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg shadow-sm">
                      {isEdit ? 'Save Changes' : 'Add Bill'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
