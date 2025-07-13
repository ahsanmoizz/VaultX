declare global {
  interface Window {
    faceIO: any;
  }
}

export async function verifyFace(): Promise<boolean> {
  try {
    const result = await window.faceIO.enroll({ locale: "auto" });
    console.log("✅ FaceIO verified:", result);
    return true;
  } catch (err) {
    console.warn("❌ FaceIO failed", err);
    return false;
  }
}
