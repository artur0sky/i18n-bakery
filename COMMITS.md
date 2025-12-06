# 🥯 Bakery Commit Guidelines (The Recipe Book)

To ensure our bakery runs smoothly and our history is as clean as a freshly wiped counter, we follow **Conventional Commits** with a bakery twist.

## 📝 Format (The Recipe Card)

Every commit message should look like this:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**Example:**
`feat(core): add new sourdough starter logic`

## 🏷️ Types (Ingredients)

Use these types to label your contributions:

| Type | Bakery Meaning | Description |
| :--- | :--- | :--- |
| **`feat`** | **New Menu Item** | A new feature for the user, not a new build script. |
| **`fix`** | **Burnt Crust** | A bug fix. Fixing something that went wrong in the oven. |
| **`docs`** | **Recipe Update** | Documentation only changes. Updating the cookbook. |
| **`style`** | **Garnish** | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc). |
| **`refactor`** | **Kneading** | A code change that neither fixes a bug nor adds a feature. Just better dough structure. |
| **`perf`** | **Crispy** | A code change that improves performance. Making it crunchier. |
| **`test`** | **Taste Test** | Adding missing tests or correcting existing tests. |
| **`build`** | **Bake** | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm). |
| **`ci`** | **Kitchen Setup** | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs). |
| **`chore`** | **Prep Work** | Other changes that don't modify src or test files. Cleaning the kitchen. |
| **`revert`** | **Undo Recipe** | Reverts a previous commit. |

## 🎯 Scopes (Sections of the Kitchen)

*   `core`
*   `react`
*   `cli`
*   `docs`
*   `examples`

## 📏 Rules (Health & Safety)

1.  **Imperative Mood:** Use "add" not "added", "fix" not "fixed". (e.g., "Add flour", not "Added flour").
2.  **Lower Case:** Don't capitalize the first letter of the subject.
3.  **No Period:** Do not end the subject line with a period.

---

*Happy Baking!* 🥖
