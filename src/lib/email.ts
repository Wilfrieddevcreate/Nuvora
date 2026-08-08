import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@nuvora.app";

export async function sendProductApprovedEmail(creatorEmail: string, productTitle: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: creatorEmail,
    subject: `✅ Votre produit "${productTitle}" a été approuvé`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Votre produit a été approuvé ! 🎉</h2>
        <p>Bonjour,</p>
        <p>Bonne nouvelle ! Votre produit "<strong>${productTitle}</strong>" a été examiné et approuvé par notre équipe.</p>
        <p>Il est maintenant visible sur Nuvora et les utilisateurs peuvent le découvrir.</p>
        <p>
          <a href="https://nuvora.app/dashboard/statistiques" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Voir vos statistiques</a>
        </p>
        <p>À bientôt,<br>L'équipe Nuvora</p>
      </div>
    `,
  });
}

export async function sendProductRejectedEmail(creatorEmail: string, productTitle: string, reason?: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: creatorEmail,
    subject: `❌ Votre produit "${productTitle}" a besoin de modifications`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Votre produit a besoin de modifications</h2>
        <p>Bonjour,</p>
        <p>Votre produit "<strong>${productTitle}</strong>" a été examiné par notre équipe.</p>
        ${reason ? `<p>Raison : <strong>${reason}</strong></p>` : ""}
        <p>Veuillez améliorer votre fiche produit et le soumettre de nouveau.</p>
        <p>
          <a href="https://nuvora.app/dashboard/produits" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Éditer votre produit</a>
        </p>
        <p>À bientôt,<br>L'équipe Nuvora</p>
      </div>
    `,
  });
}

export async function sendNewReviewEmail(creatorEmail: string, productTitle: string, reviewerName: string, rating: number) {
  const stars = "⭐".repeat(rating);
  return resend.emails.send({
    from: FROM_EMAIL,
    to: creatorEmail,
    subject: `💬 Nouvel avis ${stars} sur votre produit`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nouvel avis sur votre produit 💬</h2>
        <p>Bonjour,</p>
        <p><strong>${reviewerName}</strong> a laissé un avis ${stars} sur votre produit "<strong>${productTitle}</strong>".</p>
        <p>
          <a href="https://nuvora.app/dashboard/statistiques" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Voir les avis</a>
        </p>
        <p>À bientôt,<br>L'équipe Nuvora</p>
      </div>
    `,
  });
}

export async function sendNewProductSubmittedEmail(adminEmail: string, productTitle: string, creatorName: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `📦 Nouveau produit à modérer: "${productTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nouveau produit en attente de modération 📦</h2>
        <p>Bonjour Admin,</p>
        <p><strong>${creatorName}</strong> a soumis un nouveau produit:</p>
        <p style="font-size: 16px; font-weight: bold;">${productTitle}</p>
        <p>
          <a href="https://nuvora.app/admin/produits" style="background-color: #ff0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Modérer maintenant</a>
        </p>
        <p>À bientôt,<br>L'équipe Nuvora</p>
      </div>
    `,
  });
}

export async function sendNewReviewSubmittedEmail(adminEmail: string, productTitle: string, reviewerName: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `💬 Nouvel avis à modérer sur "${productTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nouvel avis en attente de modération 💬</h2>
        <p>Bonjour Admin,</p>
        <p><strong>${reviewerName}</strong> a laissé un avis sur "<strong>${productTitle}</strong>".</p>
        <p>
          <a href="https://nuvora.app/admin/avis" style="background-color: #ff0000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Modérer maintenant</a>
        </p>
        <p>À bientôt,<br>L'équipe Nuvora</p>
      </div>
    `,
  });
}

export const sendCreatorVerifiedEmail = async (email: string, creatorName: string): Promise<void> => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "🎉 Tu es créateur vérifié sur Nuvora!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; margin-bottom: 20px;">🎉 Félicitations!</h1>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Bonjour ${creatorName},
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Tu as été certifié comme <strong>créateur vérifié</strong> sur Nuvora! 
          Le badge "Créateur vérifié" apparaît maintenant sur tous tes produits.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          <strong>Avantages de la certification:</strong>
        </p>
        
        <ul style="color: #666; line-height: 1.8; margin-bottom: 20px;">
          <li>✓ Badge "Créateur vérifié" visible sur tous tes produits</li>
          <li>✓ Meilleure visibilité dans le catalogue</li>
          <li>✓ Confiance accrue auprès des acheteurs</li>
          <li>✓ Priorité dans les résultats de l'assistant IA</li>
        </ul>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Accède à ton dashboard pour voir tes produits avec le nouveau badge:
        </p>
        
        <a href="https://nuvora.app/dashboard" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Voir mon dashboard
        </a>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 14px;">
          L'équipe Nuvora
        </p>
      </div>
    `,
  });
};
