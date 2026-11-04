export const PROFILE_CARD_QUERY = `query ProfileCard {
  profile {
    id
    name
    description
    links {
      kind
      url
      label
    }
    skills {
      name
      category
    }
    experiences {
      company
      position
      startDate
      endDate
      achievements
    }
    projects {
      name
      url
      description
    }
  }
}`;
