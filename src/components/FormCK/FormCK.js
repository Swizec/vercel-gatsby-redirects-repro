import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Box, Button, Flex, Image, Input, Label, Grid, Text } from "theme-ui"
import fetch from "node-fetch"
import styled from "@emotion/styled"
import omit from "lodash.omit"

import DefaultBeforeCopy from "./DefaultBeforeCopy"
import DefaultLeftCopy from "./DefaultLeftCopy"
import ThankYou from "./ThankYou"
import BouncingLoader from "../BouncingLoader"
import emailRobot from "../../images/email-robot.gif"
import { useFormsQuery } from "./useFormsQuery"

export function useEmailForm(formName, onSuccess) {
  const { register, handleSubmit, formState, getValues } = useForm({
    mode: "onChange",
  })

  const [submitError, setSubmitError] = useState()
  const [formSuccess, setFormSuccess] = useState(false)

  const forms = useFormsQuery()
  const formId = forms[`${formName || "default"}FormId`]

  const uniqueId = `${new Date().getTime()}`

  const onSubmit = async (data) => {
    //If address is filled then it's spam
    if (!data.address && data.name && data.email) {
      const url = `https://api.convertkit.com/v3/forms/${formId}/subscribe`
      const headers = {
        "Content-Type": 'application/json; charset="utf-8"',
      }
      const bodyData = {
        api_key: process.env.GATSBY_CONVERTKIT_APIKEY,
        email: data.email,
        first_name: data.name,
        fields: omit(data, ["email", "name"]),
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(bodyData),
        })
        const json = await response.json()

        if (!response.ok || !json?.subscription?.id) {
          setSubmitError(
            "Sorry there was an error, try again later or <a target='_blank' href='https://twitter.com/swizec'>contact me</a>!"
          )
        } else {
          setFormSuccess(true)
          if (window.plausible) {
            window.plausible("Email Signup", {
              props: {
                formName,
              },
            })
          }

          if (typeof onSuccess === "function") {
            onSuccess(data)
          }
        }
      } catch (error) {
        console.log("Error", error)
      }
    }
  }

  return {
    submitError,
    formSuccess,
    register,
    formState,
    uniqueId,
    getValues,
    onSubmit: handleSubmit(onSubmit),
  }
}

const FormCK = ({
  copyBefore,
  submitText,
  formName,
  children,
  onSuccess,
  sx = {},
}) => {
  const { submitError, formSuccess, register, formState, uniqueId, onSubmit } =
    useEmailForm(formName, onSuccess)

  return (
    <Box
      sx={{
        mt: [2, 3, 3],
        ml: ["-32px", "-64px"],
        mr: ["-32px", "-64px"],
        mb: [2, 3, 3],
        p: 1,
        ...sx,
      }}
      role="dialog"
    >
      {copyBefore}

      {formSuccess ? (
        <Box
          px={4}
          style={{
            textAlign: "center",
          }}
        >
          <ThankYou />
        </Box>
      ) : (
        <Grid columns={[1, 2]}>
          <Box
            sx={{
              bg: "copyBackground",
              textAlign: "center",
              p: 3,
            }}
          >
            {children}
          </Box>
          <Flex
            as="form"
            onSubmit={onSubmit}
            sx={{ justifyContent: "center", flexDirection: "column" }}
          >
            <Label htmlFor={`${uniqueId}-name`}>Your Name</Label>

            <Input
              id={`${uniqueId}-name`}
              type="text"
              name="name"
              {...register("name", {
                required: true,
                message: "⚠️ Name is required",
              })}
              placeholder="John Doe"
            />
            {formState.errors.name && (
              <span>{formState.errors.name.message}</span>
            )}
            <Label htmlFor={`${uniqueId}-email`} sx={{ mt: 3 }}>
              Your Email
            </Label>
            <Input
              id={`${uniqueId}-email`}
              type="email"
              name="email"
              {...register("email", {
                required: "⚠️ E-mail is required",
                pattern: {
                  value: ".+@.+..+",
                  message: "⚠️ Invalid email address",
                },
              })}
              placeholder="email@example.com"
            />
            {formState.errors.email && (
              <span>{formState.errors.email.message}</span>
            )}

            <Label
              htmlFor={`${uniqueId}-address`}
              className="required"
              sx={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
              }}
            >
              Your Address
            </Label>
            <input
              className="required"
              autoComplete="nope"
              type="text"
              id={`${uniqueId}-address`}
              name="address"
              {...register}
              placeholder="Your address here"
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
              }}
            />
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              sx={{ mt: 3, cursor: "pointer" }}
            >
              {formState.isSubmitting ? <BouncingLoader /> : submitText}
            </Button>
            {submitError && (
              <p dangerouslySetInnerHTML={{ __html: submitError }}></p>
            )}
            <Text sx={{ fontSize: "0.8em", mt: 2, textAlign: "center" }} as="p">
              Join <b>16K+ engineers</b> learning lessons from my{" "}
              <em>"raw and honest from the heart"</em> emails.
            </Text>
          </Flex>
        </Grid>
      )}
    </Box>
  )
}

FormCK.defaultProps = {
  children: <DefaultLeftCopy />,
  copyBefore: <DefaultBeforeCopy />,
  submitText: "Subscribe now",
}

const FormCkWrapper = styled.div`
  box-shadow: 0 2px 15px 0 rgba(210, 214, 220, 0.5);

  .copy-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

    overflow: hidden;
    align-items: center;

    .copy-left {
      background-color: #f9fafb;
      padding: 2rem;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;

    padding: 2rem;
    text-align: center;

    input {
      border-color: #e3e3e3;
      border-radius: 4px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.4;
      padding: 0.8rem;
    }

    label {
      margin-top: 1rem;
      margin-bottom: 0.1rem;
    }

    span {
      color: red;
      text-align: left;
    }

    .required {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 0;
      width: 0;
      z-index: -1;
    }

    button {
      background-color: #1677be;
      border-radius: 24px;
      color: #fff;
      cursor: pointer;
      height: 64px;
      font-size: 1rem;
      font-weight: 700;
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      outline: none !important;
    }
  }

  form.tiny {
    padding-top: 0;
    padding-bottom: 1rem;
  }
`

export const TinyFormCK = ({
  submitText,
  formName,
  children,
  onSuccess,
  sx = {},
}) => {
  const { formSuccess, onSubmit, uniqueId, register, formState, submitError } =
    useEmailForm(formName, onSuccess)

  return (
    <FormCkWrapper sx={{ justifyContent: "center", ...sx }} role="dialog">
      {children}

      <Box className="copy-content tiny" as="form" onSubmit={onSubmit}>
        {formSuccess ? (
          <Box
            px={4}
            style={{
              textAlign: "center",
            }}
          >
            <p>The email robots will be in touch with you shortly.</p>
            <Image src={emailRobot} />
          </Box>
        ) : (
          <>
            <Box>
              <Label htmlFor={`${uniqueId}-name`} sx={{ mt: "0 !important" }}>
                Your Name
              </Label>
              <Input
                id={`${uniqueId}-name`}
                type="text"
                name="name"
                {...register("name", {
                  required: true,
                  message: "⚠️ Name is required",
                })}
                placeholder="Your name"
              />
              {formState.errors.name && (
                <span>{formState.errors.name.message}</span>
              )}

              <Label htmlFor={`${uniqueId}-email`}>Your Email</Label>
              <Input
                id={`${uniqueId}-email`}
                type="email"
                name="email"
                {...register("email", {
                  required: "⚠️ E-mail is required",
                  pattern: {
                    value: ".+@.+..+",
                    message: "⚠️ Invalid email address",
                  },
                })}
                placeholder="Your email address"
              />
              {formState.errors.email && (
                <span>{formState.errors.email.message}</span>
              )}
            </Box>
            <Box sx={{ p: 2 }}>
              <Label htmlFor={`${uniqueId}-address`} className="required">
                Your Address
              </Label>
              <input
                className="required"
                autoComplete="nope"
                type="text"
                id={`${uniqueId}-address`}
                name="address"
                {...register}
                placeholder="Your address here"
              />
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                sx={{ mb: 24, position: "relative", top: 24, height: 48 }}
              >
                {formState.isSubmitting ? <BouncingLoader /> : submitText}
              </Button>
              {submitError && (
                <p dangerouslySetInnerHTML={{ __html: submitError }}></p>
              )}
              <p style={{ fontSize: "0.8em" }}>
                I like privacy too. No spam, no selling your data.
              </p>
            </Box>
          </>
        )}
      </Box>
    </FormCkWrapper>
  )
}

export default FormCK
