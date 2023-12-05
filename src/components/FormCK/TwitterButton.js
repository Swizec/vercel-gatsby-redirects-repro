import React from "react"
import styled from "@emotion/styled"
import { Box } from "theme-ui"

const TwitterButton = ({ onButtonClick }) => {
  return (
    <Box sx={{ bg: "copyBackground" }}>
      <TwitterButtonWrapper>
        Can't wait to read @swizec's software engineering lessons from
        production. No bullshit.{" "}
        <span role="img" aria-label="finger-right">
          👉
        </span>{" "}
        https://swizec.com/lettersn
        <a
          onClick={onButtonClick}
          target="_blank"
          rel="noreferrer"
          href="http://twitter.com/intent/tweet?text=Can't%20wait%20to%20read%20%40swizec's%20software%20engineering%20lessons%20from%20production.%20No%20bullshit.%20%F0%9F%91%89%20https%3A%2F%2Fswizec.com%2Fletters%2F"
        >
          <img src={"/twitter.png"} alt="twitter" />
          <span>Share to get bonus</span>
        </a>
      </TwitterButtonWrapper>
    </Box>
  )
}

const TwitterButtonWrapper = styled.div`
  border: 1px solid #d2e1db;
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 1em;

  a {
    display: inline-flex;
    align-items: center;

    background-color: #2185d0;
    background-image: none;
    border-radius: 5px;
    box-shadow: 0px 0em 0px 0px rgba(34, 36, 38, 0.15) inset;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
    text-shadow: none;
    padding: 0.5rem 1rem;
    margin-top: 1em;

    img {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`

export default TwitterButton
