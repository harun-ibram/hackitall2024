import React from "react"
import { fetch_scores, search_for_megas } from "./populate"
import { resolve } from "path"

function App () {
		
	return (
		<>
			<div>
				HELLO!
			</div>
			<div>
				<button onClick={async () => {
					let url = "https://places.googleapis.com/v1/places:searchText"
					let response = await search_for_megas()
					return <></>
				}}>click</button>
			</div>
		</>
	)
}

export default App