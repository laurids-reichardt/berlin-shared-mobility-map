import ReactMarkdown from 'markdown-to-jsx'
import { Typography, Link } from '@mui/material'
import { Profile } from './Profile'
import { Charts } from './Charts'

/**
 * Ensure HTML table td elements got some padding.
 */
function TD(props: any) {
  return <td style={{ padding: '4px' }}>{props.children}</td>
}

const options = {
  overrides: {
    h1: { component: Typography, props: { gutterBottom: true, variant: 'h4', fontWeight: 'fontWeightBold' } },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h5', fontWeight: 500 } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    p: { component: Typography, props: { paragraph: true, sx: { hyphens: 'auto' } } },
    a: { component: Link, props: { target: '_blank', rel: 'noreferrer' } },
    td: { component: TD },
    Profile: { component: Profile },
    Charts: { component: Charts },
  },
}

export default function Markdown(props: any) {
  return <ReactMarkdown options={options} {...props} />
}
