// Using the Edamam API (free tier)
const APP_ID = "YOUR_APP_ID"; // Get from https://developer.edamam.com/
const APP_KEY = "YOUR_APP_KEY";

document.getElementById('generate-btn').addEventListener('click', async () => {
    const diet = document.getElementById('diet').value;
    const ingredients = document.getElementById('ingredients').value;
    
    try {
        const response = await fetch(
            `https://api.edamam.com/search?q=${ingredients}&app_id=${APP_ID}&app_key=${APP_KEY}&diet=${diet}`
        );
        const data = await response.json();
        displayRecipe(data.hits[0].recipe);
    } catch (error) {
        alert("Failed to fetch recipes. Try again!");
    }
});

function displayRecipe(recipe) {
    const resultDiv = document.getElementById('recipe-result');
    resultDiv.classList.remove('hidden');
    
    document.getElementById('recipe-title').textContent = recipe.label;
    document.getElementById('recipe-image').src = recipe.image;
    
    let details = `
        <p><strong>Calories:</strong> ${Math.round(recipe.calories)}</p>
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${recipe.ingredientLines.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <a href="${recipe.url}" target="_blank">View Full Recipe</a>
    `;
    
    document.getElementById('recipe-details').innerHTML = details;
    
    document.getElementById('save-btn').onclick = () => saveRecipe(recipe);
}

function saveRecipe(recipe) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    savedRecipes.push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}

function displaySavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const list = document.getElementById('saved-list');
    list.innerHTML = savedRecipes.map(recipe => 
        `<li>${recipe.label} <button onclick="removeRecipe('${recipe.uri}')">❌</button></li>`
    ).join('');
}

function removeRecipe(uri) {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes'));
    savedRecipes = savedRecipes.filter(recipe => recipe.uri !== uri);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    displaySavedRecipes();
}

// Load saved recipes on page load
displaySavedRecipes();