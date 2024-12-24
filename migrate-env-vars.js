const fs = require("fs");
const path = require("path");

const envMapping = {
  REACT_APP_GOOGLE_MAPS_API_KEY: "VITE_GOOGLE_MAPS_API_KEY",
  REACT_APP_GENERATE_SOURCEMAP: "VITE_GENERATE_SOURCEMAP",
  REACT_APP_API: "VITE_API",
  REACT_APP_orgName: "VITE_orgName",
  REACT_APP_foundation_date: "VITE_foundation_date",
  REACT_APP_web_url: "VITE_web_url",
  REACT_APP_industry_type: "VITE_industry_type",
  REACT_APP_email: "VITE_email",
  REACT_APP_organization_linkedin_url: "VITE_organization_linkedin_url",
  REACT_APP_location_address: "VITE_location_address",
  REACT_APP_location_position_lat: "VITE_location_position_lat",
  REACT_APP_location_position_lng: "VITE_location_position_lng",
  REACT_APP_contact_number: "VITE_contact_number",
  REACT_APP_description: "VITE_description",
  REACT_APP_creator: "VITE_creator",
  REACT_APP_isTrial: "VITE_isTrial",
  REACT_APP_packageInfo: "VITE_packageInfo",
  REACT_APP_count: "VITE_count",
  REACT_APP_cycleCount: "VITE_cycleCount",
  REACT_APP_paymentType: "VITE_paymentType",
  REACT_APP_BASICPLAN: "VITE_BASICPLAN",
  REACT_APP_INTERMEDIATE: "VITE_INTERMEDIATE",
  REACT_APP_ENTERPRISE: "VITE_ENTERPRISE",
};

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updatedContent = content;

  for (const [oldVar, newVar] of Object.entries(envMapping)) {
    const oldPattern = new RegExp(`process\\.env\\.${oldVar}`, "g");
    const newReplacement = `import.meta.env.${newVar}`;
    updatedContent = updatedContent.replace(oldPattern, newReplacement);
  }

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated: ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir) {
  let updatedFiles = 0;
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updatedFiles += walkDir(filePath);
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      if (replaceInFile(filePath)) {
        updatedFiles++;
      }
    }
  });

  return updatedFiles;
}

// Start the script from your src directory
const totalUpdated = walkDir("./src");
console.log(`Total files updated: ${totalUpdated}`);
