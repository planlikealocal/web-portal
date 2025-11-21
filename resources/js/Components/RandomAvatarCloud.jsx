import React, { useMemo } from "react";
import { Box, Avatar } from "@mui/material";

const RandomAvatarCloud = ({
  avatarUrls = [],
  totalCircles = 28,
  minSize = 40,
  maxSize = 120,
  areaWidth = 330,
  areaHeight = 380,
  maxAttempts = 300,
}) => {
  const circles = useMemo(() => {
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const generated = [];

    for (let i = 0; i < totalCircles; i++) {
      const size =
        Math.floor(seededRandom() * (maxSize - minSize + 1)) + minSize;

      let x, y, valid;
      let attempts = 0;

      do {
        valid = true;
        attempts++;

        x = Math.floor(seededRandom() * (areaWidth - size));
        y = Math.floor(seededRandom() * (areaHeight - size));

        // Check for overlap
        for (const c of generated) {
          const dx = c.x - x;
          const dy = c.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (c.size / 2 + size / 2) + 4) {
            valid = false;
            break;
          }
        }

        if (attempts > maxAttempts) break;
      } while (!valid);

      generated.push({
        size,
        x,
        y,
        avatarUrl: avatarUrls[i] || null,
      });
    }

    return generated;
  }, [totalCircles, minSize, maxSize, areaWidth, areaHeight]);

  return (
    <Box
      sx={{
        width: areaWidth,
        height: areaHeight,
        position: "relative",
      }}
    >
      {circles.map((circle, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            borderRadius: "50%",
            backgroundColor: "#EDF1F5",
            border: "2px solid #D3D9E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {circle.avatarUrl ? (
            <Avatar
              src={circle.avatarUrl}
              sx={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              sx={{
                width: "60%",
                height: "60%",
                opacity: 0.25,
                backgroundImage:
                  "url('data:image/svg+xml;utf8,<svg fill=\"gray\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z\"/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default RandomAvatarCloud;
