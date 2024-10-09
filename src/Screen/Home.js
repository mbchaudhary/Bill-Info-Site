import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
  Badge,
  Card,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx"; // Import XLSX for Excel export

export default function Home() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterOption, setFilterOption] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [totalUserPay, setTotalUserPay] = useState(0);
  const [totalUserNotPay, setTotalUserNotPay] = useState(0);
  const [shopName, setShopName] = useState("");
  const [isClick, setIsClick] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const storeBills = JSON.parse(localStorage.getItem("list"));
    if (storeBills) {
      setTotalUser(storeBills.length);
      setTotalUserPay(
        storeBills.filter((bill) => bill.paymentStatus === "Pay").length
      );
      setTotalUserNotPay(
        storeBills.filter((bill) => bill.paymentStatus === "NotPay").length
      );
      setBills(storeBills);
      setFilteredBills(storeBills);
    }
    const storedShopName = localStorage.getItem("shop_name");
    if (storedShopName) {
      setShopName(storedShopName);
    }
  }, []);

  const handleEdit = (index) => {
    localStorage.setItem("EditDataIndex", index);
    localStorage.setItem("isEdit", true);
    nav("/add_bill");
  };

  const handleDelete = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    setBills(updatedBills);
    setFilteredBills(updatedBills);
    localStorage.setItem("list", JSON.stringify(updatedBills));
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
    let filtered = bills.filter((bill) =>
      bill.name.toLowerCase().includes(term)
    );

    if (option === "amount") {
      filtered = filtered.sort(
        (a, b) => parseFloat(a.amount) - parseFloat(b.amount)
      );
    } else if (option === "date") {
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredBills(filtered);
  };

  const handleShopName = () => {
    if (isClick) {
      localStorage.setItem("shop_name", shopName);
      setIsClick(false);
    } else {
      setIsClick(true);
    }
  };

  const handleExport = () => {
    const exportData = filteredBills.map((bill, index) => ({
      No: index + 1,
      Date: bill.date,
      Name: bill.name,
      Amount: bill.amount,
      Payment_Status: bill.paymentStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");
    XLSX.writeFile(workbook, "bills.xlsx");
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <Row className="align-items-center">
          {isClick ? (
            <Col className="text-center">
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="form-control shadow-sm"
                readOnly={!isClick}
              />
            </Col>
          ) : (
            <Col className="text-center">
              <h2>{shopName}</h2>
            </Col>
          )}
          <Col className="col-auto ms-auto">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>{isClick ? "Save Shop Name" : "Edit Shop Name"}</Tooltip>
              }
            >
              <Button
                variant="primary"
                onClick={handleShopName}
                size="sm"
                className="shadow-sm"
              >
                {isClick ? "Save" : "Edit"}
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </div>

      {/* Search, Filter, and Export Section */}
      <Row className="mb-4 align-items-center">
        <Col md={5} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="shadow-sm"
          />
        </Col>
        <Col md={2} className="mb-2">
          <Form.Select
            value={filterOption}
            onChange={handleFilterChange}
            className="shadow-sm"
          >
            <option value="">Sort by</option>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </Form.Select>
        </Col>
        <Col md={2} className="mb-2">
          <Button
            variant="secondary"
            onClick={handleExport}
            className="shadow-sm"
          >
            <i className="bi bi-file-earmark-excel me-2"></i>Export to Excel
          </Button>
        </Col>
        <Col md={3} className="text-end">
          <Button
            variant="primary"
            onClick={() => nav("/add_bill")}
            className="shadow-sm"
          >
            <i className="bi bi-plus-circle me-2"></i>Add New Bill
          </Button>
        </Col>
      </Row>

      {/* Total Customers and Bill-Pay Section */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-white text-center shadow-sm border-0 bg-info">
            <Card.Body>
              <Card.Title>Total Customers</Card.Title>
              <h2 className="card-text">{totalUser}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white text-center shadow-sm border-0 bg-success">
            <Card.Body>
              <Card.Title>Total Bill Paid</Card.Title>
              <h2 className="card-text">{totalUserPay}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-white text-center shadow-sm border-0 bg-danger">
            <Card.Body>
              <Card.Title>Total Bill Not Paid</Card.Title>
              <h2 className="card-text">{totalUserNotPay}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bill Table */}
      {filteredBills.length > 0 ? (
        <Table
          striped
          bordered
          hover
          responsive
          className="shadow-sm text-center table-striped"
        >
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
                  <Badge
                    pill
                    bg={bill.paymentStatus === "Pay" ? "success" : "danger"}
                  >
                    {bill.paymentStatus}
                  </Badge>
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
        <h5 className="text-center mt-5 text-muted">No bills found</h5>
      )}
    </div>
  );
}
