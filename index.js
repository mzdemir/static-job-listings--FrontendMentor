const wrapper = document.querySelector(".wrapper")

const response = await fetch("data.json")
const data = await response.json()

//prettier-ignore
const jobCard = (item) => `
  <section class="job-card">
    <div class="job-card-title-container">
      <img class="job-logo" src="${item.logo}" alt="${item.company} logo" />
      <div>
        <header class="job-card-title text-preset-4-bold">
          <span class="company ">${item.company}</span>
          ${item.new ? "<span class='new'>NEW!</span>" : ""}
          ${item.featured ? "<span class='featured'>FEATURED</span>" : ""}
        </header>
        <h1 class="position text-preset-3-bold">${item.position}</h1>
        <ul class="card-meta text-preset-3-medium">
          <li>${item.postedAt}</li>
          <li>${item.contract}</li>
          <li>${item.location}</li>
        </ul>
      </div>
    </div>
    <div class="job-skills-container text-preset-3-bold">
      <button class="job-skill" data-name="${item.role}" aria-label="Click to add filter">${item.role}</button>
      <button class="job-skill" data-name="${item.level}" aria-label="Click to add filter">${item.level}</button>
      ${item.languages.map((item) => 
        `<button class="job-skill" data-name="${item}" aria-label="Click to add filter">${item}</button>`).join("")
      }
      ${item.tools
        ? item.tools.map((item) => 
          `<button class="job-skill" data-name="${item}" aria-label="Click to add filter">${item}</button>`).join("")
        : ""
      }
    </div>
  </section>
`

function renderJobs(jobs) {
	wrapper.innerHTML = `
    <div class="filter-bar text-preset-3-bold" aria-live="polite"></div>
     <div class="job-card-container">
      ${jobs.map(jobCard).join("")} 
     </div>
  `
}

renderJobs(data)

let selectedFilters = []
document.addEventListener("click", (event) => {
	if (event.target.dataset.name) {
		const skill = event.target.dataset.name

		if (!selectedFilters.includes(skill)) {
			selectedFilters.push(skill)
			applyFilters()
		}
	}

	if (event.target.dataset.filter) {
		const filter = event.target.dataset.filter
		selectedFilters = selectedFilters.filter((item) => item !== filter)
		applyFilters()
	}

	if (event.target.classList.contains("clear-filters")) {
		selectedFilters = []
		applyFilters()
	}
})

function applyFilters() {
	const filteredData = data.filter((job) => {
		const tags = [job.role, job.level, ...job.languages, ...job.tools]
		return selectedFilters.every((filter) => tags.includes(filter))
	})

	renderJobs(filteredData)
	renderFilterBar()
}

function renderFilterBar() {
	const filterBar = document.querySelector(".filter-bar")

	if (selectedFilters.length === 0) {
		filterBar.style.display = "none"
		filterBar.innerHTML = ""
		return
	}

	filterBar.style.display = "flex"
	//prettier-ignore
	filterBar.innerHTML = `
    <div class="selected-filters">
      ${selectedFilters.map((filter) => `
        <p class="filter-tag">${filter}
          <button class="remove-filter" data-filter="${filter}" aria-label="Remove ${filter} filter"></button>
        </p>
      `).join("")}
    </div>
    <button class="clear-filters" aria-label="Clear all filters">Clear</button>
  `
}
