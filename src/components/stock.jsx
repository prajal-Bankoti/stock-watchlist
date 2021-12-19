import { useState, useEffect } from "react";
import "./stock.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import SettingsIcon from "@mui/icons-material/Settings";
import CancelIcon from "@mui/icons-material/Cancel";
import { Card } from "./card";
const axios = require("axios");
const link = "https://stocks-json-data.herokuapp.com/";

export default function Stoks() {
  const [stockdata, setStockata] = useState([]);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState([]);
  const [show, setShow] = useState([]);
  const [hover, setHover] = useState([]);
  const [watch, setWach] = useState(false);
  const [card, setCard] = useState(false);
  const [formet, setFormet] = useState(false);
  const [sort, setSort] = useState(false);

  useEffect(() => {
    async function showData() {
      try {
        const { data } = await axios.get(
          `${link}stocksData?list=true&_sort=companyName&_order=${
            sort ? "asc" : "desc"
          }`
        );

        setStockata(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    showData();
  }, [update, sort]);

  async function showSearchData() {
    try {
      const { data } = await axios.get(
        `${link}stocksData?q=${search}&_page=1&_limit=30`
      );
      setShow(data);
      setCard(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function showUpdate(e) {
    try {
      await axios.patch(`${link}stocksData/${e.id}`, {
        list: e.list ? false : true,
      });
      await showSearchData();
      setUpdate(update ? false : true);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(formet);
  return (
    <div
      className="box"
      onClick={(el) => {
        console.log(el.target.nodeName);
        if (el.target.nodeName !== "svg" && el.target.nodeName !== "INPUT") {
          setWach(false);
          setSearch("");
        }
      }}
    >
      <div id="main-box">
        <div id="input">
          <div>
            {" "}
            {watch ? (
              <></>
            ) : card ? (
              <CancelIcon
                onClick={() => {
                  setCard(!card);
                }}
              />
            ) : (
              <SettingsIcon
                onClick={() => {
                  setCard(!card);
                }}
              />
            )}
          </div>
          <h3>{watch ? "ADD STOCKS..." : "YOUR WATHLIST "}</h3>
          <h4>{stockdata.length}</h4>
          <input
            onChange={(e) => {
              setSearch(e.target.value);
              setWach(true);
              showSearchData();
            }}
            value={search}
            onKeyPress={(en) => {
              if (en.code === "Enter") {
                setWach(true);
                showSearchData();
                console.log(en.code);
              }
            }}
            type="text"
            placeholder="Search Stocks..."
            id=""
          />
        </div>

        <div style={{ width: "100%", height: "85px" }}></div>
        <Card value={card} formet={setFormet} sort={sort} setsort={setSort} />

        <div>
          {watch
            ? show.map((el) => (
                <div
                  key={`${el.id}A`}
                  onMouseOver={() => {
                    setHover(el.id);
                  }}
                  onMouseOut={() => {
                    setHover();
                  }}
                  className="stock-list"
                >
                  <div
                    style={{
                      color: el.todayPrice < el.yesPrice ? "#df514c" : "green",
                    }}
                  >
                    {el.companyName}
                  </div>
                  <div>{el.stockExchange}</div>
                  <div>
                    {el.yesPrice - el.todayPrice < 0
                      ? (
                          ((el.todayPrice - el.yesPrice) / el.yesPrice) *
                          100
                        ).toFixed(2)
                      : (
                          ((el.yesPrice - el.todayPrice) / el.yesPrice) *
                          100
                        ).toFixed(2)}{" "}
                    %
                  </div>
                  {el.todayPrice < el.yesPrice ? (
                    <KeyboardArrowDownIcon
                      style={{
                        color:
                          el.todayPrice < el.yesPrice ? "#df514c" : "green",
                      }}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      style={{
                        color:
                          el.todayPrice < el.yesPrice ? "#df514c" : "green",
                      }}
                    />
                  )}

                  <div
                    style={{
                      color: el.todayPrice < el.yesPrice ? "#df514c" : "green",
                    }}
                  >
                    {el.todayPrice}
                  </div>
                  <div
                    className="stock-pop"
                    style={{
                      display: hover === el.id ? "block" : "none",
                    }}
                  >
                    <ErrorOutlineIcon />
                    {el.list ? (
                      <DeleteOutlineIcon
                        onClick={(e) => {
                          showUpdate(el);
                          console.log(e);
                        }}
                      />
                    ) : (
                      <AddIcon
                        onClick={() => {
                          showUpdate(el);
                          console.log(el);
                        }}
                      />
                    )}
                    <div>N</div>
                    <div>B</div>
                  </div>
                </div>
              ))
            : stockdata.map((el) => (
                <div
                  key={`${el.id}A`}
                  onMouseOver={() => {
                    setHover(el.id);
                  }}
                  onMouseOut={() => {
                    setHover();
                  }}
                  className="stock-list"
                >
                  <div
                    style={{
                      color: el.todayPrice < el.yesPrice ? "#df514c" : "green",
                    }}
                  >
                    {el.companyName}
                  </div>
                  <div>{el.stockExchange}</div>
                  <div>
                    {formet
                      ? (el.todayPrice - el.yesPrice).toFixed(0)
                      : el.yesPrice - el.todayPrice < 0
                      ? (
                          ((el.todayPrice - el.yesPrice) / el.yesPrice) *
                          100
                        ).toFixed(2) + "  %"
                      : (
                          ((el.yesPrice - el.todayPrice) / el.yesPrice) *
                          100
                        ).toFixed(2) + "  %"}{" "}
                  </div>
                  {el.todayPrice < el.yesPrice ? (
                    <KeyboardArrowDownIcon
                      style={{
                        color:
                          el.todayPrice < el.yesPrice ? "#df514c" : "green",
                      }}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      style={{
                        color:
                          el.todayPrice < el.yesPrice ? "#df514c" : "green",
                      }}
                    />
                  )}

                  <div
                    style={{
                      color: el.todayPrice < el.yesPrice ? "#df514c" : "green",
                    }}
                  >
                    {el.todayPrice}
                  </div>
                  <div
                    className="stock-pop"
                    style={{
                      display: hover === el.id ? "block" : "none",
                    }}
                  >
                    <ErrorOutlineIcon />
                    <DeleteOutlineIcon
                      onClick={() => {
                        showUpdate(el);
                        console.log(el);
                      }}
                    />
                    <div>N</div>
                    <div>B</div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {show.length === 0 && stockdata.length === 0 ? (
        <CircularProgress style={{ marginTop: "200px", overflow: "hidden" }} />
      ) : (
        <></>
      )}
    </div>
  );
}
