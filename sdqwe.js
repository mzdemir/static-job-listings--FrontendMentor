const wrapper = document.querySelector(".wrapper")
const filterBar = document.querySelector(".filter-bar")
let selectedFilters = []

const response = await fetch("data.json")
const data = await response.json()

const jobCard = (item) => `
  <section class="job-card">
    <img class="job-logo" src="${item.logo}" alt="" />
    <div class="job-card-details">
      <div class="job-card-title-container">
        <header class="job-card-title text-preset-4-bold">
          <span class="company">${item.company}</span>
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
      <div class="job-skills-container text-preset-3-bold">
        <button class="job-skill" data-name="${item.role}">${item.role}</button>
        <button class="job-skill" data-name="${item.level}">${item.level}</button>
        ${item.languages.map((lang) => `<button class="job-skill" data-name="${lang}">${lang}</button>`).join("")}
        ${
					item.tools
						? item.tools.map((tool) => `<button class="job-skill" data-name="${tool}">${tool}</button>`).join("")
						: ""
				}
      </div>
    </div>
  </section>
`

function renderJobs(jobs) {
	wrapper.innerHTML = `
    <div class="filter-bar"></div>
    ${jobs.map(jobCard).join("")} 
  `
}

function renderFilterBar() {
	if (selectedFilters.length === 0) {
		filterBar.style.display = "none"
		filterBar.innerHTML = ""
		return
	}

	filterBar.style.display = "flex"

	filterBar.innerHTML = `
    <div class="selected-filters">
      ${selectedFilters
				.map(
					(filter) => `
        <span class="filter-tag">
          ${filter}
          <button class="remove-filter" data-filter="${filter}">x</button>
        </span>
      `
				)
				.join("")}
    </div>
    <button class="clear-filters">Clear</button>
  `
}

function applyFilters() {
	const filtered = data.filter((job) => {
		const tags = [job.role, job.level, ...job.languages, ...(job.tools || [])]
		return selectedFilters.every((f) => tags.includes(f))
	})

	renderJobs(filtered)
	renderFilterBar()
}

// Handle job skill clicks
wrapper.addEventListener("click", (event) => {
	if (event.target.classList.contains("job-skill")) {
		const skill = event.target.dataset.name
		if (!selectedFilters.includes(skill)) {
			selectedFilters.push(skill)
			applyFilters()
		}
	}
})

// Handle filter tag removal or clearing
filterBar.addEventListener("click", (event) => {
	if (event.target.classList.contains("remove-filter")) {
		const filter = event.target.dataset.filter
		selectedFilters = selectedFilters.filter((f) => f !== filter)
		applyFilters()
	}

	if (event.target.classList.contains("clear-filters")) {
		selectedFilters = []
		applyFilters()
	}
})

// Initial render
renderJobs(data)
