import React from "react";
import "./_reportTabs.scss";
import TailmapReport from "../TailmapReport/TailmapReport";
import HeatmapReport from "../HeatmapReport/HeatmapReport";
import TableReport from "../TableReport/TableReport";

const Tabs = () => {
  return (
    <div className="tabs__container">
      <input
        type="radio"
        id="tab1"
        name="tab-control"
        defaultChecked
        className="tabs__input"
      />
      <input
        type="radio"
        id="tab2"
        name="tab-control"
        className="tabs__input"
      />
      <input
        type="radio"
        id="tab3"
        name="tab-control"
        className="tabs__input"
      />
      <input
        type="radio"
        id="tab4"
        name="tab-control"
        className="tabs__input"
      />

      <ul className="tabs__list">
        <li className="tabs__list-item" title="Features">
          <label htmlFor="tab1" className="tabs__list-item-label" role="button">
            <span>Heat map</span>
          </label>
        </li>
        <li className="tabs__list-item" title="Delivery Contents">
          <label htmlFor="tab2" className="tabs__list-item-label" role="button">
            <span>Tail map</span>
          </label>
        </li>
        <li className="tabs__list-item" title="Shipping">
          <label htmlFor="tab3" className="tabs__list-item-label" role="button">
            <span>Table report</span>
          </label>
        </li>
      </ul>

      <div className="tabs__slider">
        <div className="tabs__slider-indicator"></div>
      </div>
      <div className="tabs__content">
        <section className="tabs__content-section">
          <HeatmapReport />
        </section>
        <section className="tabs__content-section">
          <TailmapReport />
        </section>
        <section className="tabs__content-section">
          <TableReport />
        </section>
      </div>
    </div>
  );
};

export default Tabs;
