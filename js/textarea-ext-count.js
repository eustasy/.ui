/**
 * Textarea character count — updates .textarea-count with the current length
 * and maxlength of any .textarea-field[maxlength] within a .textarea-group.
 *
 * Usage:
 *   <script src="js/textarea-ext-count.js"></script>
 *
 *   <div class="textarea-group">
 *     <label class="textarea-label" for="bio">Bio</label>
 *     <textarea class="textarea-field" id="bio" rows="4"
 *               aria-describedby="bio-footer"
 *               maxlength="200"></textarea>
 *     <div class="textarea-footer" id="bio-footer">
 *       <p class="textarea-hint">Keep it concise.</p>
 *       <span class="textarea-count" aria-live="polite">0 / 200</span>
 *     </div>
 *   </div>
 */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".textarea-field[maxlength]").forEach((field) => {
    const group = field.closest(".textarea-group")
    const counter = group && group.querySelector(".textarea-count")
    if (!counter) return

    const update = () => {
      counter.textContent = field.value.length + " / " + field.maxLength
    }

    field.addEventListener("input", update)
    update()
  })
})
