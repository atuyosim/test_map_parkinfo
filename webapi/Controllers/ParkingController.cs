using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

[ApiController]
[Route("api")]
public class ParkingController : ControllerBase
{
    private readonly string _connectionString;

    public ParkingController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    [HttpGet("getParkingData")]
    public async Task<IActionResult> GetParkingData()
    {
        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            string query = @"
                SELECT 
                  [company],
                  [companyname],
                  [parkcd],
                  [取得日],
                  [取得日時],
                  [県名],
                  [市町村名],
                  [駐車場名],
                  [URL],
                  [緯度],
                  [経度],
                  [住所],
                  [台数等],
                  [車両制限],
                  [入出庫可能時間],
                  [駐車場写真のURL],
                  [料金ファイル],
                  [登録日時],
                  [ryokin],
                  [ryokin_changed]
                FROM VParkInfo";

            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            var result = new List<Dictionary<string, object>>();

            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.GetValue(i);
                }
                result.Add(row);
            }

            return Ok(result);
        }
        catch (SqlException ex)
        {
            return StatusCode(500, new { error = "Database query failed", details = ex.Message });
        }
    }

    [HttpGet("getRyokin")]
    public async Task<IActionResult> GetRyokin([FromQuery] string parkcd)
    {
        if (string.IsNullOrEmpty(parkcd))
        {
            return BadRequest("parkcd is required");
        }

        try
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            string query = @"
                SELECT  
                  [parkcd],
                  [getinfodate],
                  [parkname],
                  [url],
                  [taisyoname1],
                  [maxprice_desc1],
                  [maxprice_detail1],
                  [normalprice_desc1],
                  [normalprice_detail1],
                  [taisyoname2],
                  [maxprice_desc2],
                  [maxprice_detail2],
                  [normalprice_desc2],
                  [normalprice_detail2],
                  [taisyoname3],
                  [maxprice_desc3],
                  [maxprice_detail3],
                  [normalprice_desc3],
                  [normalprice_detail3],
                  [taisyoname4],
                  [maxprice_desc4],
                  [maxprice_detail4],
                  [normalprice_desc4],
                  [normalprice_detail4],
                  [taisyoname5],
                  [maxprice_desc5],
                  [maxprice_detail5],
                  [normalprice_desc5],
                  [normalprice_detail5]
                FROM VParkinfo_ryokin_DISP
                WHERE parkcd = @parkcd
                ORDER BY getinfodate DESC";

            using var command = new SqlCommand(query, connection);
            command.Parameters.Add(new SqlParameter("@parkcd", SqlDbType.NVarChar) { Value = parkcd });

            using var reader = await command.ExecuteReaderAsync();

            var result = new List<Dictionary<string, object>>();

            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.GetValue(i);
                }
                result.Add(row);
            }

            return Ok(result);
        }
        catch (SqlException ex)
        {
            return StatusCode(500, new { error = "Database query failed", details = ex.Message });
        }
    }
}
