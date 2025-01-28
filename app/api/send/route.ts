// app/api/send/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    // Validación básica
    if (!username) {
      return new NextResponse(
        JSON.stringify({ error: "El nombre de usuario es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Configurar transporter (usando SMTP)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Solicitud de recuperación de contraseña - Usuario: ${username}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              .email-container {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
              }
              .header {
                background-color: #2c5282;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                background-color: white;
                padding: 20px;
                border-radius: 0 0 5px 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              .username {
                color: #2c5282;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1 style="margin:0">Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <h2>Nueva solicitud de recuperación</h2>
                <p>Se ha recibido una solicitud de recuperación de contraseña para el usuario:</p>
                <p class="username">${username}</p>
                <p>Detalles de la solicitud:</p>
                <ul>
                  <li>Fecha y hora: ${new Date().toLocaleString()}</li>
                </ul>
                <p>Por favor, revisa esta solicitud y toma las acciones necesarias para ayudar al usuario.</p>
              </div>
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>© ${new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
