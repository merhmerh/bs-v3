export const companyCategories = [
	"Interior Design",
	"Architecture",
	"Products",
	"Engineering",
	"C&S Engineering",
	"MEP Engineering",
	"Contractors",
	"Facility Management",
	"Real Estate Developer",
	"Information Technology ",
	"Landscape",
	"Others",
];

export const peopleIndustries = [
	"Architecture",
	"Construction",
	"Engineering",
	"Environmental Sustainability",
	"Facilities Management",
	"Information Technology",
	"Interior Design",
	"Landscape Architecture",
	"Project Management",
	"Surveying",
	"Landscape",
	"Urban Planning",
];

const allEnums = [...companyCategories, ...peopleIndustries];

export function matchEnums(str) {
	return allEnums.find((item) => item.toLowerCase().includes(str.toLowerCase()));
}
