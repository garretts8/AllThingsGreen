// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector passed to qs(): "${selector}"`, error);
    return null;
  }
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value; 
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  const value = typeof data === "string" ? data : JSON.stringify(data);
  localStorage.setItem(key, value);
}

export async function renderWithTemplate(
    templateFn
  , parentElement
  , data
  , callback
  , position = "afterbegin", clear = true
){
    // get template using function
    if (clear) {
      parentElement.innerHTML = "";
    }

    const htmlStrings = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlStrings);

    if(callback) {
      callback(data)
    }
}

function loadTemplate(path) {

    return async function () {
        const res = await fetch(path);
        if (res.ok) {
        const html = await res.text();
        return html;
        }
    };
} 

export async function loadHeaderFooter() {
  try {
    const headerTemplateFn = loadTemplate("./partials/header.html");
    const footerTemplateFn = loadTemplate("./partials/footer.html");
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (!headerElement || !footerElement) {
      console.error("Header or footer element not found");
      return;
    }

    await renderWithTemplate(headerTemplateFn, headerElement);
    await renderWithTemplate(footerTemplateFn, footerElement);
  } catch (error) {
    console.error("Failed to load header/footer:", error);
  }
}
