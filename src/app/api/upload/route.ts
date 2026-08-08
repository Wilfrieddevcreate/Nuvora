import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getSession } from "@/lib/auth";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "products");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    // Vérifier session
    const session = await getSession();
    if (!session?.userId) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer le fichier
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "Aucun fichier envoyé" }, { status: 400 });
    }

    // Valider type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Format non autorisé. JPG, PNG, WebP ou GIF seulement." },
        { status: 400 }
      );
    }

    // Valider taille
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "Fichier trop gros (max 5MB)" },
        { status: 400 }
      );
    }

    // Générer nom unique
    const timestamp = Date.now();
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");
    const filename = `${timestamp}-${sanitizedName}`;

    // Créer dossier s'il n'existe pas
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Sauvegarder fichier
    const buffer = await file.arrayBuffer();
    const filepath = join(UPLOAD_DIR, filename);
    await writeFile(filepath, Buffer.from(buffer));

    // Retourner chemin public
    const publicPath = `/uploads/products/${filename}`;
    return Response.json({ url: publicPath }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
