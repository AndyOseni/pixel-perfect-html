<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Extend the legacy prebundled portal through progressive DOM decoration and scoped CSS, because its authored React source is not present.
- Apply dashboard decoration only while the rendered portal has a signed-in navigation and Logout control; remove all shell decoration on auth views because React reuses header and root nodes.
