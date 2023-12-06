import React, { useState } from "react"
import ThankYouTwitter from "./ThankYouTwitter.mdx"
import ThankYouResources from "./ThankYouResources.mdx"
import styled from "@emotion/styled"

import TwitterButton from "./TwitterButton"

const ThankYou = () => {
  const [showResources, setShowResources] = useState(false)

  return (
    <ThankYouWrapper>
      {showResources ? (
        <ThankYouResources />
      ) : (
        <>
          <ThankYouTwitter />
          <TwitterButton onButtonClick={() => setShowResources(true)} />
        </>
      )}
    </ThankYouWrapper>
  )
}

const ThankYouWrapper = styled.div`
  h2 {
    color: rgba(0, 153, 229, 1);
  }

  ul {
    list-style: none;
    margin: 2rem auto;
    padding-left: 0;

    li {
      display: flex;
      align-items: center;
      font-size: 1.3em;
      font-weight: 500;
      text-align: left;
      margin-bottom: 1rem;

      img {
        height: 1.5em;
        margin-right: 1rem;
      }

      a {
        display: inline-flex;
        align-items: center;
        background-color: #2185d0;
        border-radius: 5px;
        color: #ffffff;
        cursor: pointer;
        padding: 0.5rem 1rem;
        text-decoration: none;
        width: fit-content;

        img {
          margin-right: 1rem;
        }
      }

      div {
        display: flex;
        flex-direction: column;
      }
    }
  }

  @media (min-width: 960px) {
    ul {
      width: 82%;
    }
  }
`

export default ThankYou
