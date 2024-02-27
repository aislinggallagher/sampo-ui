const perspectiveID = 'perspective1'

export const workProperties = `
    {
      ?id b2022:geo_identifier ?prefLabel__id .
      BIND(?prefLabel__id AS ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
`

export const knowledgeGraphMetadataQuery = `
select ?g (count(*) as ?c)
  where
  {
    graph ?g {
      ?s ?p ?o
    }
}
group by ?g
order by DESC(?c)
`
