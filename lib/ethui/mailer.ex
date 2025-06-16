defmodule Ethui.Mailer do
  use Swoosh.Mailer, otp_app: :ethui

  import Swoosh.Email

  @from {"ethui", "noreply@ethui.app"}

  def test do
    new()
    |> to("mpalhas@gmail.com")
    |> from(@from)
    |> subject("Test email")
    |> text_body("This is a test email")
    |> deliver()
  end

  def auth_code(user, code) do
    new()
    |> from(@from)
    |> to(user.email)
    |> subject("ethui verification code")
    |> html_body("""
    <h1>ethui verification code</h1>
    <p>Your 6-digit verification code is:</p>
    <h2 style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">#{code}</h2>
    <p>This code will expire in 1 hour.</p>
    """)
    |> text_body("""
    Your ethui verification code is: #{code}

    This code will expire in 1 hour.
    """)
  end
end
