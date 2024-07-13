let g:netrw_winsize = 21
let g:netrw_liststyle = 3
let g:netrw_banner = 0
let g:netrw_altv = 1
let g:netrw_browse_split = 0

let &t_SI = "\e[6 q"
let &t_EI = "\e[2 q"

" Make 'q' close Netrw when it's the only window
augroup netrw_mapping
    autocmd!
    autocmd filetype netrw nnoremap <buffer><silent><nowait> q :bd<CR>
    autocmd FileType netrw nnoremap <buffer><silent> h :norm -<CR>
augroup END

hi TabLineFill ctermfg=black ctermbg=blue
hi TabLine ctermfg=blue ctermbg=black cterm=none
hi TabLineSel ctermfg=white ctermbg=black



" Map space in normal mode to navigate between splits
nnoremap <M-f> <Esc>
nnoremap <silent> <Space> <C-W>w
nnoremap <silent> sf :Lexplore<CR>
nnoremap <silent> sv :vsplit<CR>
nnoremap <silent> te :tabnew<CR>
nnoremap <silent> tl :tabnext<CR>
nnoremap <silent> th :tabprevious<CR>

function! Tabline() abort
    let l:line = ''
    let l:current = tabpagenr()

    for l:i in range(1, tabpagenr('$'))
        if l:i == l:current
            let l:line .= '%#TabLineSel#'
        else
            let l:line .= '%#TabLine#'
        endif

        let l:label = fnamemodify(
            \ bufname(tabpagebuflist(l:i)[tabpagewinnr(l:i) - 1]),
            \ ':t'
        \ )

        let l:line .= '%' . i . 'T' " Starts mouse click target region.
        let l:line .= '  ' . l:label . '  '
    endfor

    let l:line .= '%#TabLineFill#'
    let l:line .= '%T' " Ends mouse click target region(s).

    return l:line
endfunction

set tabline=%!Tabline()
