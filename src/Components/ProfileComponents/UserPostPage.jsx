import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
} from "@mui/material";

// Data dummy posts user
const dummyPosts = [
  {
    id: 1,
    title: "Mengenal React Hooks",
    content:
      "React hooks memungkinkan kamu menggunakan state dan lifecycle di functional components sehingga kode menjadi lebih ringkas dan mudah dipahami.",
    date: "2024-08-01",
  },
  {
    id: 2,
    title: "Tips Menjadi Developer Produktif",
    content:
      "Produktivitas bisa meningkat dengan teknik manajemen waktu dan fokus yang tepat. Gunakan teknik Pomodoro untuk hasil maksimal.",
    date: "2024-07-28",
  },
  {
    id: 3,
    title: "Pengalaman Belajar TypeScript",
    content:
      "TypeScript memberikan tipe statis pada JavaScript, membantu menemukan error lebih awal dan meningkatkan maintainability kode.",
    date: "2024-07-20",
  },
  {
    id: 4,
    title: "Membangun Portfolio Online",
    content:
      "Portfolio online adalah kunci agar perusahaan dapat melihat hasil kerja dan skill-mu secara mudah. Gunakan tools modern untuk membuatnya menarik.",
    date: "2024-07-15",
  },
];

export default function UserPostPage({ limit }) {
  const displayedPosts = limit ? dummyPosts.slice(0, limit) : dummyPosts;

  return (
    <Box mx="auto" mt={4} px={2} maxWidth={700} sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        textAlign="center"
        color="primary.main"
      >
        Postingan User
      </Typography>

      <Stack spacing={3}>
        {displayedPosts.map((post) => (
          <Card
            key={post.id}
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                {post.content.length > 120
                  ? post.content.substring(0, 120) + "..."
                  : post.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" disabled>
                Like
              </Button>
              <Button size="small" disabled>
                Comment
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
