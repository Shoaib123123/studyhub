export async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to download file.");
    }

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename || "download";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Unable to download this file.");
  }
}