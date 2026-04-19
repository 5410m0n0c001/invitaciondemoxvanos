// Supabase Config (Same as main page)
const SUPABASE_URL = 'https://fhnnqmbbeeobassvfeox.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobm5xbWJiZWVvYmFzc3ZmZW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDAyOTgsImV4cCI6MjA1NzgyMDMwNH0.7LrT_oGYH0cSMjLggJKo8y4s4NX5pLH-cGHBhjvXEW4';
const ALBUM_ID = 'boda-demo';

let supabaseClient = null;

const btnCamera = document.getElementById('btn-camera');
const photoInput = document.getElementById('photo-input');
const uploadStatus = document.getElementById('upload-status');
const uploadSuccess = document.getElementById('upload-success');
const photoGallery = document.getElementById('photo-gallery');

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        fetchGallery();
    } else {
        console.error('Supabase SDK not loaded');
    }
}

// Handle Camera Button
if (btnCamera) {
    btnCamera.addEventListener('click', () => photoInput.click());
}

// Handle Upload
if (photoInput) {
    photoInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file || !supabaseClient) return;

        // UI State: Uploading
        btnCamera.style.display = 'none';
        uploadStatus.style.display = 'block';
        uploadSuccess.style.display = 'none';

        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${ALBUM_ID}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data: uploadData, error: uploadError } = await supabaseClient.storage
                .from('fotos-album')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('fotos-album')
                .getPublicUrl(filePath);

            // 3. Save to Database
            const { error: dbError } = await supabaseClient
                .from('fotos')
                .insert([{ url: publicUrl, album_id: ALBUM_ID }]);

            if (dbError) throw dbError;

            // UI State: Success
            uploadStatus.style.display = 'none';
            uploadSuccess.style.display = 'block';
            
            // Refresh gallery after a short delay
            setTimeout(() => { fetchGallery(); }, 1500);
            
            // Reset after 3 seconds
            setTimeout(function() {
                uploadSuccess.style.display = 'none';
                btnCamera.style.display = 'flex';
                photoInput.value = '';
            }, 3000);

        } catch (err) {
            console.error('Upload error:', err);
            uploadStatus.style.display = 'none';
            btnCamera.style.display = 'flex';
            photoInput.value = '';
            alert('Error al subir la foto. Por favor intenta de nuevo.');
        }
    });
}

// Fetch Gallery
async function fetchGallery() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('fotos')
            .select('*')
            .eq('album_id', ALBUM_ID)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        renderGallery(data);
    } catch (err) { 
        console.error('Error fetching gallery:', err); 
    }
}

function renderGallery(photos) {
    if (!photoGallery || !photos || photos.length === 0) return;
    
    let html = '';
    for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        html += `<img src="${p.url}" alt="Recuerdo" style="animation-delay: ${i * 0.1}s">`;
    }
    
    photoGallery.innerHTML = html;
}

// Initial Load
document.addEventListener('DOMContentLoaded', initSupabase);
