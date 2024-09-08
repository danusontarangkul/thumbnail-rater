import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

// Custom Hook to get the public URL from storageId
export function usePublicImageUrl(storageId: string | null) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getPublicUrl = useMutation(api.files.getPublicUrl);

  useEffect(() => {
    if (!storageId) return;

    const fetchPublicUrl = async () => {
      setLoading(true);
      try {
        const response = await getPublicUrl({ storageId });
        if (response) {
          setPublicUrl(response);
        } else {
          setError("Failed to retrieve public URL");
        }
      } catch (err) {
        setError(`Error retrieving public URL: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicUrl();
  }, [storageId, getPublicUrl]);

  return { publicUrl, loading, error };
}
