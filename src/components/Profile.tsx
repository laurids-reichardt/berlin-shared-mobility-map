import { Button, Typography, Stack, Link } from '@mui/material'
import { GitHub, LinkedIn, Twitter } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import profilePictureURL from '../../static_assets/laurids.jpg?url'

/**
 * The Profile component displays a small avatar profile picture of myself and provides links to my social sites.
 */
export function Profile() {
  return (
    <Stack alignItems="center" marginBottom={3}>
      <ProfileHead />
      <SocialLinks />
    </Stack>
  )
}

function ProfileHead() {
  return (
    <Stack direction="row" spacing={2} alignItems="center" marginTop={1} marginBottom={1}>
      <Avatar alt="Laurids Reichardt" src={profilePictureURL} sx={{ width: 52, height: 52 }} />

      <Stack alignItems="center" padding={2} paddingLeft={0}>
        <Typography>Created by</Typography>
        <Link href="https://www.linkedin.com/in/laurids-reichardt/" target="_blank" rel="noreferrer">
          Laurids Reichardt
        </Link>
      </Stack>
    </Stack>
  )
}

function SocialLinks() {
  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 3 }}>
      <Button
        startIcon={<Twitter />}
        // @ts-ignore
        color="Twitter"
        href="https://twitter.com/laureichardt"
        target="_blank"
        rel="noreferrer"
      >
        Twitter
      </Button>

      <Button
        startIcon={<GitHub />}
        // @ts-ignore
        color="GitHub"
        href="https://github.com/laurids-reichardt"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </Button>

      <Button
        startIcon={<LinkedIn />}
        // @ts-ignore
        color="LinkedIn"
        href="https://www.linkedin.com/in/laurids-reichardt/"
        target="_blank"
        rel="noreferrer"
      >
        LinkedIn
      </Button>
    </Stack>
  )
}
