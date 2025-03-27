import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

export const sendBoardInvitation = functions.firestore
  .document('pendingInvites/{inviteId}')
  .onCreate(async (snap, context) => {
    const invite = snap.data();
    const boardSnap = await admin.firestore()
      .collection('boards')
      .doc(invite.boardId)
      .get();
    
    if (!boardSnap.exists) {
      console.error('Board not found');
      return;
    }

    const board = boardSnap.data();
    const ownerSnap = await admin.firestore()
      .collection('users')
      .doc(board?.ownerId)
      .get();
    
    const owner = ownerSnap.data();
    
    const mailOptions = {
      from: `"Product Research Tracker" <${functions.config().email.user}>`,
      to: invite.email,
      subject: `You've been invited to collaborate on "${board?.name}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0;">Product Research Tracker</h1>
          </div>
          
          <div style="padding: 32px; background: white;">
            <h2 style="color: #1f2937; margin-top: 0;">You've Been Invited!</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              ${owner?.firstName || owner?.email} has invited you to collaborate on their board "${board?.name}" as a ${invite.role}.
            </p>
            
            <div style="margin: 32px 0;">
              <a href="https://your-app-url.com/signup?invite=${snap.id}" 
                 style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              If you already have an account, simply sign in and you'll be automatically added to the board.
            </p>
          </div>
          
          <div style="padding: 32px; background: #f3f4f6; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This invitation was sent to ${invite.email}</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending invitation email:', error);
    }
  });