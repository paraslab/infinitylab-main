import { useEffect, useState } from "react";
import { getMediaByKey } from "../api/media";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

export default function useMedia(key) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key) return;

    getMediaByKey(key)
      .then((res) => {
        setImage(`${BACKEND_URL}/${res.data.data.image}`);
      })
      .catch(() => setImage(null))
      .finally(() => setLoading(false));
  }, [key]);

  return { image, loading };
}
