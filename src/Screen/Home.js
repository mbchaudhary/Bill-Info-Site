import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterOption, setFilterOption] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    const storeBills = JSON.parse(localStorage.getItem("list"));
    if (storeBills) {
      setBills(storeBills);
      setFilteredBills(storeBills);
    }
  }, []);

  const handleEdit = (index) => {
    localStorage.setItem('EditDataIndex', index);
    localStorage.setItem('isEdit', true);
    nav('/add_bill');
  };

  const handleDelete = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    setBills(updatedBills);
    setFilteredBills(updatedBills);
    localStorage.setItem('list', JSON.stringify(updatedBills));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterBills(value, filterOption);
  };

  const handleFilterChange = (e) => {
    const option = e.target.value;
    setFilterOption(option);
    filterBills(searchTerm, option);
  };

  const filterBills = (term, option) => {
    let filtered = bills.filter(bill =>
      bill.name.toLowerCase().includes(term)
    );

    if (option === "amount") {
      filtered = filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else if (option === "date") {
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredBills(filtered);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Bill Management</h2>

      {/* Search and Filter Section */}
      <Row className="mb-4 justify-content-center align-items-center">
        <Col md={6} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="shadow-sm"
          />
        </Col>
        <Col md={3} className="mb-2">
          <Form.Select value={filterOption} onChange={handleFilterChange} className="shadow-sm">
            <option value="">Sort by</option>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="primary" onClick={() => nav('/add_bill')} className="shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Bill
          </Button>
        </Col>
      </Row>

      {/* Bill Table */}
      {filteredBills.length > 0 ? (
        <Table striped bordered hover responsive className="shadow-sm text-center">
          <thead className="table-dark">
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{bill.date}</td>
                <td>{bill.name}</td>
                <td className="fw-bold text-success">${bill.amount}</td>
                <td>
                  <span className={`badge ${bill.paymentStatus === 'Pay' ? 'bg-success' : 'bg-danger'}`}>
                    {bill.paymentStatus}
                  </span>
                </td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Edit Bill</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(index)}
                      size="sm"
                      className="shadow-sm"
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Delete Bill</Tooltip>}
                  >
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(index)}
                      size="sm"
                      className="shadow-sm"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-warning text-center shadow-sm" role="alert">
          No bills available. Please add a new bill.
        </div>
      )}
    </div>
  );
}
