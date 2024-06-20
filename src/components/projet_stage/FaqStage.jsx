import React, { useState } from "react";
import { faqStage } from "../../dummydata";
import Heading from "../common/heading/Heading";
import { Link, useLocation } from "react-router-dom";
import './Faq.css';

const FaqStage = () => {
  const [click, setClick] = useState(false);
  const location = useLocation();

  const toggle = (index) => {
    if (click === index) {
      return setClick(null);
    }
    setClick(index);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <Heading subtitle='FAQS' title={
        <>
          <Link to="/stage" className={`faq-link ${isActive('/stage') ? 'faq-link-active' : ''}`} >Stage</Link> | <Link to="/projet" className={`faq-link ${isActive('/projet') ? 'faq-link-active' : ''}`}>  Projet</Link>
        </>
      } />
      <section className='faq'>
        <div className='container'>
          {faqStage.map((val, index) => (
            <div className='box' key={index}>
              <button className='accordion' onClick={() => toggle(index)}>
                <h2>{val.title}</h2>
                <span>{click === index ? <i className='fa fa-chevron-down'></i> : <i className='fa fa-chevron-right'></i>}</span>
              </button>
              {click === index ? (
                <div className='text'>
                  <p>{val.desc}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FaqStage;