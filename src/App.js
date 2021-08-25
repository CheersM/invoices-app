import React from 'react';
import axios from 'axios';
import { format, parseISO, parse } from 'date-fns';

import { AddInvoice, Button, ListItem } from './components';
import refreshSvg from './assets/refresh.svg';

function App() {
  const [modalActive, setModalActive] = React.useState(false);
  const [invoices, setInvoices] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [numberValue, setNumberValue] = React.useState('');
  const [dateCreatedValue, setDateCreatedValue] = React.useState('');
  const [dateSuppliedValue, setDateSuppliedValue] = React.useState('');
  const [commentValue, setCommentValue] = React.useState('');

  const onClose = () => {
    setModalActive(false);
    setNumberValue('');
    setDateCreatedValue('');
    setDateSuppliedValue('');
    setCommentValue('');
  };

  React.useEffect(() => {
    axios.get('http://localhost:3001/db.json').then(({ data }) => {
      setInvoices(data.invoices);
    });
  }, []);

  const saveInvoice = () => {
    if (!numberValue || !dateCreatedValue || !dateSuppliedValue || !commentValue) {
      alert('Please enter values');
      return;
    }
    setIsLoading(true);
    axios
      .post('http://localhost:3001/invoices', {
        id: Math.random().toString(16).slice(2),
        date_created: format(parseISO(dateCreatedValue), 'dd-MM-yyyy'),
        number: numberValue,
        date_supplied: format(parseISO(dateSuppliedValue), 'dd-MM-yyyy'),
        comment: commentValue,
      })
      .then(({ data }) => {
        setInvoices(data[0].invoices);
        onClose();
      })
      .catch(() => {
        alert('Error saving invoice');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const randomNum = () => {
    setNumberValue(Math.floor(Math.random() * 999999));
  };

  const onEditInvoice = (invoice) => {
    console.log(invoice);
    setNumberValue(invoice.number);
    setDateCreatedValue(
      format(parse(invoice.date_created, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd'),
    );
    setDateSuppliedValue(
      format(parse(invoice.date_supplied, 'dd-MM-yyyy', new Date()), 'yyyy-MM-dd'),
    );
    setCommentValue(invoice.comment);
  };

  return (
    <div className="_list">
      <div className="wrapper">
        <div className="list">
          <div className="invoices_title">
            <h1>Invoices</h1>
            <div className="line"></div>
          </div>
          <div className="actionsAdd">
            <h2>Actions</h2>
            <Button onClick={() => setModalActive(true)}>Add new</Button>
          </div>
          <div className="invoices">
            <h2>Invoices</h2>
            <span>{invoices && `(${invoices.length})`}</span>
            <div className="items_selector">
              <p>Create</p>
              <p>No</p>
              <p>Supply</p>
              <p>Comment</p>
              <p>Options</p>
            </div>
            {invoices ? (
              <ListItem
                items={invoices}
                isRemovable
                onEditInvoice={onEditInvoice}
                onModal={setModalActive}
                onRemove={(id) => {
                  const newInvoice = invoices.filter((obj) => obj.id !== id);
                  setInvoices(newInvoice);
                }}
              />
            ) : (
              <span>'Loading invoices...'</span>
            )}
          </div>
        </div>
        <AddInvoice active={modalActive} setActive={setModalActive}>
          <div className="invoice_body">
            <svg
              onClick={onClose}
              width="35"
              height="35"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.63 10.315C20.63 10.2335 20.6291 10.1523 20.6272 10.0712C20.4972 4.49574 15.9212 0 10.315 0C4.62737 0 0 4.62737 0 10.315C0 15.9721 4.57776 20.5802 10.2234 20.6296C10.2539 20.6299 10.2844 20.63 10.315 20.63C10.3456 20.63 10.3761 20.6299 10.4066 20.6296C16.0522 20.5802 20.63 15.9721 20.63 10.315ZM14.2303 13.1855C14.1879 13.0885 14.1265 13.0009 14.0497 12.928L11.4373 10.315L14.0497 7.70203C14.1922 7.55202 14.2705 7.35226 14.2679 7.14536C14.2652 6.93846 14.1819 6.74077 14.0355 6.59446C13.8892 6.44814 13.6915 6.36477 13.4846 6.36212C13.2777 6.35947 13.078 6.43775 12.928 6.58028L10.315 9.19275L7.70203 6.58028C7.55202 6.43775 7.35226 6.35947 7.14536 6.36212C6.93846 6.36477 6.74077 6.44814 6.59446 6.59446C6.44814 6.74077 6.36477 6.93846 6.36212 7.14536C6.35947 7.35226 6.43775 7.55202 6.58028 7.70203L9.19275 10.315L6.58028 12.928C6.43775 13.078 6.35947 13.2777 6.36212 13.4846C6.36477 13.6915 6.44814 13.8892 6.59446 14.0355C6.74077 14.1819 6.93846 14.2652 7.14536 14.2679C7.35226 14.2705 7.55202 14.1922 7.70203 14.0497L10.315 11.4373L12.928 14.0497C13.0009 14.1265 13.0885 14.1879 13.1855 14.2303C13.2826 14.2727 13.3872 14.2952 13.4931 14.2966C13.599 14.298 13.7041 14.2781 13.8022 14.2382C13.9003 14.1983 13.9894 14.1392 14.0643 14.0643C14.1392 13.9894 14.1983 13.9003 14.2382 13.8022C14.2781 13.7041 14.298 13.599 14.2966 13.4931C14.2953 13.3872 14.2727 13.2826 14.2303 13.1855Z"
                fill="#5E5E5E"
              />
            </svg>
            <div className="invoice_content">
              <div className="invoice_title">
                <h2>Create Invoice</h2>
                <div className="line"></div>
              </div>
              <div className="invoice_text">
                <div className="invoice_form" id="invoice_form">
                  <form name="newInvoice" method="" id="prompt_form">
                    <div className="wrapper_num">
                      <div className="number">
                        <label htmlFor="number">Number:</label>
                        <div className="number_block">
                          <input
                            value={numberValue}
                            id="number"
                            type="number"
                            placeholder="000002"
                            onChange={(e) => setNumberValue(e.target.value)}
                          />
                          <img
                            onClick={randomNum}
                            id="img"
                            src={refreshSvg}
                            border="1px solid #000"
                            alt="img"></img>
                        </div>
                      </div>
                      <div className="invoiceDate">
                        <label htmlFor="invoiceDate">Invoice Date:</label>
                        <input
                          value={dateCreatedValue}
                          id="invoiceDate"
                          type="date"
                          name="invoiceDate"
                          onChange={(e) => setDateCreatedValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="wrapper_date">
                      <div className="supplyDate">
                        <label htmlFor="supplyDate">Supply Date:</label>
                        <input
                          value={dateSuppliedValue}
                          id="supplyDate"
                          type="date"
                          name="supplyDate"
                          onChange={(e) => setDateSuppliedValue(e.target.value)}
                        />
                      </div>
                      <div className="null"></div>
                    </div>
                    <div className="comment">
                      <label htmlFor="comment">Comment:</label>
                      <textarea
                        value={commentValue}
                        id="comment"
                        maxLength="160"
                        onChange={(e) => setCommentValue(e.target.value)}></textarea>
                    </div>
                  </form>
                </div>
                <div className="button_wrapper">
                  <Button onClick={saveInvoice} className="save-button">
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AddInvoice>
      </div>
    </div>
  );
}

export default App;
