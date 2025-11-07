import React from "react";

export default function Video({ id, title }) {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: 12,
        boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}


