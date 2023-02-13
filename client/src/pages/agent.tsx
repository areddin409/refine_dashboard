import { useList } from "@pankod/refine-core"
import { Box, Typography } from "@pankod/refine-mui"

import { AgentCard } from "components"

const Agent = () => {
  const { data, isLoading, isError } = useList({
    resource: "users"
  })

  const allAgents = data?.data

  return <div>agent</div>
}

export default Agent
